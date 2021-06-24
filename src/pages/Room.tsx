import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import logoImg from '../assets/images/logo.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [question, setQuestion] = useState('')

  const roomId = params.id

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    if (question.trim() === '') {
      toast.error('Digite uma pergunta', { duration: 3000 })
      return
    }

    if (!user) {
      toast.error('User not authenticated', { duration: 3000 })
      return
    }

    const questionData = {
      content: question,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(questionData)

    setQuestion('')
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
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            value={question}
            onChange={event => setQuestion(event.target.value)}
          />

          <div className='form-footer'>
            { user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }

            <Button
              type='submit'
              disabled={!user || !question.length}
              onClick={handleSendQuestion}
            >
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
