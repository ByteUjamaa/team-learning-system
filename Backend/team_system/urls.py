from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from rest_framework import permissions
from drf_yasg.views import get_schema_view  # type: ignore
from drf_yasg import openapi  # type: ignore

schema_view = get_schema_view(
    openapi.Info(
        title="Team Learning System API",
        default_version='v1',
        description="API documentation for the Team Learning System project.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@teamlearning.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Swagger/Redoc
    re_path(r'^api/swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json-api'),
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui-api'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc-api'),

    # App URLs
    path('api/', include('anouncements.urls')),
    path('accounts/', include('accounts.urls')),

    # Redirect root
    path('', RedirectView.as_view(url='/api/', permanent=False)),

    # Root-level Swagger and Redoc
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
