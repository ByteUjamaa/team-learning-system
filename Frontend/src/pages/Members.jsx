import React from 'react'
import TeamCard from '../components/TeamCard'
import { FiUsers, FiSearch } from 'react-icons/fi'

const demoTeams = [
  { id: 1, name: 'Frontend Learners', description: 'Practice React and UI patterns', members: 6, progress: 75, activeMembers: 4 },
  { id: 2, name: 'Backend Builders', description: 'Django, APIs and databases', members: 4, progress: 60, activeMembers: 3 },
  { id: 3, name: 'Data Enthusiasts', description: 'Data science experiments', members: 5, progress: 45, activeMembers: 2 },
  { id: 4, name: 'DevOps Crew', description: 'CI/CD, infra and monitoring', members: 3, progress: 90, activeMembers: 3 },
  { id: 5, name: 'Mobile Developers', description: 'React Native & Flutter projects', members: 7, progress: 30, activeMembers: 5 },
  { id: 6, name: 'Design Team', description: 'UI/UX design and prototyping', members: 4, progress: 85, activeMembers: 3 },
]

export default function Teams() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse or join a team to start collaborating</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FiUsers className="h-5 w-5" />
          <span>{demoTeams.reduce((sum, team) => sum + team.members, 0)} total members</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="search"
          placeholder="Search teams..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoTeams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{demoTeams.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Teams</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {demoTeams.reduce((sum, team) => sum + team.members, 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(demoTeams.reduce((sum, team) => sum + team.progress, 0) / demoTeams.length)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {demoTeams.reduce((sum, team) => sum + team.activeMembers, 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Now</p>
          </div>
        </div>
      </div>
    </div>
  )
}