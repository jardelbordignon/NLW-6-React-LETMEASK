import { ReactNode } from 'react'

import '../styles/question.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
}

export function Question({content, author, children}: QuestionProps) {
  return (
    <div className='question'>
      <p>{content}</p>
      <footer>
        <div className='user-info'>
          <div>
            <img src={author.avatar} alt={author.name} />
          </div>
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}
