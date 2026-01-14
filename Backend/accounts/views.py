from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import UserProfile
from .serializers import UserProfileSerializer, ChangePasswordSerializer, CustomTokenObtainPairSerializer


# Authentication Views
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response(
                {'error': 'Username, email, and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'username': ['A user with this username already exists.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'email': ['A user with this email already exists.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            return Response(
                {'message': 'User registered successfully.'},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."},
                            status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid or expired token."},
                            status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data['new_password'])  # type: ignore
        user.save()

        return Response({"message": "Password changed successfully."},
                        status=status.HTTP_200_OK)


# Profile Views
class UserProfileCreateView(generics.CreateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    queryset = UserProfile.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserProfileDeleteView(generics.DestroyAPIView):
    queryset = UserProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Delete profile picture if it exists
        if instance.profile_picture and instance.profile_picture.name != 'profile_pictures/default.png':
            instance.profile_picture.delete(save=False)
        self.perform_destroy(instance)
        return Response({'message': 'Profile deleted successfully'}, status=status.HTTP_200_OK)

class UserProfileListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserProfileDetailView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CurrentUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """Get or create profile for current user"""
        user_email = request.user.email
        profile, created = UserProfile.objects.get_or_create(
            email=user_email,
            defaults={
                'first_name': request.user.first_name or '',
                'last_name': request.user.last_name or '',
            }
        )
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        """Update profile for current user"""
        user_email = request.user.email
        try:
            profile = UserProfile.objects.get(email=user_email)
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(
                email=user_email,
                first_name=request.user.first_name or '',
                last_name=request.user.last_name or '',
            )
        
        # Create a mutable copy of request.data (QueryDict)
        # When using MultiPartParser, files are in request.FILES, not request.data
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        
        # Merge files from request.FILES into data
        # This is necessary because MultiPartParser separates form fields and files
        if hasattr(request, 'FILES') and request.FILES:
            for key, file in request.FILES.items():
                data[key] = file
        
        # Always set email from authenticated user (don't allow it to be changed)
        data['email'] = user_email
        
        # Ensure required fields have default values if not provided or empty
        if 'first_name' not in data or (data.get('first_name') == '' and not profile.first_name):
            data['first_name'] = profile.first_name or request.user.first_name or ''
        if 'last_name' not in data or (data.get('last_name') == '' and not profile.last_name):
            data['last_name'] = profile.last_name or request.user.last_name or ''
        
        # Pass data to serializer - it will handle both form fields and files
        serializer = UserProfileSerializer(profile, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        # Return detailed error information for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Profile update validation failed for user {user_email}: {serializer.errors}")
        if hasattr(request, 'FILES'):
            logger.error(f"Files in request: {list(request.FILES.keys())}")
        
        return Response({
            'errors': serializer.errors,
            'detail': 'Validation failed. Please check the field errors below.'
        }, status=status.HTTP_400_BAD_REQUEST)
