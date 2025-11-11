import React from 'react'

export default function TeamCard({ team }){
  return (
    <article className="team-card card">
      <h3 style={{marginTop:0}}>{team.name}</h3>
      <p style={{color:'#6b7280'}}>{team.description}</p>
      <div style={{marginTop:8, fontSize:13, color:'#374151'}}>
        Members: {team.members || 0}
      </div>
    </article>
  )
}
