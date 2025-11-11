import React from 'react'
import TeamCard from '../components/MemberCard'

const demo = [
  { id: 1, name: 'Frontend Learners', description: 'Practice React and UI patterns', members: 6 },
  { id: 2, name: 'Backend Builders', description: 'Django, APIs and databases', members: 4 },
  { id: 3, name: 'Data Enthusiasts', description: 'Data science experiments', members: 5 },
  { id: 4, name: 'DevOps Crew', description: 'CI/CD, infra and monitoring', members: 3 }
]

export default function Teams(){
  return (
    <section>
      <h1>Teams</h1>
      <p style={{color:'#6b7280'}}>Browse or join a team to start collaborating.</p>
      <div className="team-grid" style={{marginTop:12}}>
        {demo.map(t => <TeamCard key={t.id} team={t} />)}
      </div>
    </section>
  )
}
