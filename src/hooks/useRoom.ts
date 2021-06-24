import { useEffect, useState } from 'react'

import { database } from '../services/firebase'

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: string
  isHighlighted: string
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: string
  isHighlighted: string
}>

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    // roomRef.once('value', room => {
    roomRef.on('value', room => {
      const roomData = room.val()
      const roomQuestions = roomData.questions as FirebaseQuestions ?? {}
      const parsedQuestions = Object.entries(roomQuestions).map(([key, value]) => ({
        id: key,
        content: value.content,
        author: value.author,
        isHighlighted: value.isHighlighted,
        isAnswered: value.isAnswered
      }))

      setTitle(roomData.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  return { questions, title }
}
