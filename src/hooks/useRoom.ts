import { useEffect, useState } from 'react'

import { database } from '../services/firebase'
import { useAuth } from './useAuth'

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
  loveCount: number
  loveId: string | undefined
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
  loves: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

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
        isAnswered: value.isAnswered,
        likeCount: Object.values(value.likes ?? {}).length,
        likeId: Object.entries(value.likes ?? {}).find(([k, v]) => v.authorId === user?.id)?.[0],
        loveCount: Object.values(value.loves ?? {}).length,
        loveId: Object.entries(value.loves ?? {}).find(([k, v]) => v.authorId === user?.id)?.[0],
      }))

      setTitle(roomData.title)
      setQuestions(parsedQuestions)
      setIsLoading(false)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return { questions, title, isLoading }
}
