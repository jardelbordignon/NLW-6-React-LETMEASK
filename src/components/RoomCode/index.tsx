import toast from 'react-hot-toast'

import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

type RoomCodeProps = {
  code: string
}

export function RoomCode({code}: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code)
    toast.success('Copied to clipboard!');
  }

  return (
    <button
      className='room-code'
      onClick={copyRoomCodeToClipboard}
      title='Clique para copiar o código'
    >
      <div>
        <img src={copyImg} alt='Botão para copiar código da sala' />
      </div>
      <span>Sala {code}</span>
    </button>
  )
}
