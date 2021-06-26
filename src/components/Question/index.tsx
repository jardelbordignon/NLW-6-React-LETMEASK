import { ReactNode } from 'react'

import './styles.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
  isAnswered?: boolean
  isHighlighted?: boolean
}

export function Question({
  content, 
  author, 
  isAnswered = false,
  isHighlighted = false,
  children,
}: QuestionProps) {
  let className = 'question'
  if (isAnswered) className += ' answered'
  if (isHighlighted && !isAnswered) className += ' highlighted'
  
  return (
    <div className={className}>
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
