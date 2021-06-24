import { useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()

  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  return (
    <div id='page-room'>      
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined>Encerrar a sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>{title || 'Carregando...'}</h1>
          { !!questions.length && 
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          }
        </div>

        <div className='question-list'>
          { questions.map(question => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
          ))}
        </div>

      </main>
    </div>
  )
}
