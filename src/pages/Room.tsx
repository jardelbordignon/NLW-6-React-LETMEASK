import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('') 

  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    if (newQuestion.trim() === '') {
      toast.error('Digite uma pergunta', { duration: 3000 })
      return
    }

    if (!user) {
      toast.error('User not authenticated', { duration: 3000 })
      return
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
    toast.success('Pergunta enviada com sucesso', { duration: 3000 })
  }

  return (
    <div id='page-room'>      
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>{title || 'Carregando...'}</h1>
          { !!questions.length && 
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className='form-footer'>
            { user ? (
              <div className='user-info'>
                <div>
                  <img src={user.avatar} alt={user.name} />
                </div>
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }

            <Button
              type='submit'
              disabled={!user || !newQuestion.length}
              onClick={handleSendQuestion}
            >
              Enviar pergunta
            </Button>
          </div>
        </form>

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
