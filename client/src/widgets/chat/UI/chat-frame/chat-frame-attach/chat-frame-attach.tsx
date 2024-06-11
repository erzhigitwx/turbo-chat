import cl from './chat-frame-attach.module.scss'
import { useUnit } from 'effector-react'
import { $attach, attachDataChanged, attachTypeChanged } from '@/widgets/chat/model/chat-frame'
import { MutableRefObject, useState } from 'react'
import CrossImg from '@/assets/icons/cross.svg?react'
import { Button } from '@/shared/UI'

const ChatFrameAttach = ({
  mediaInputRef,
  fileInputRef,
}: {
  mediaInputRef: MutableRefObject<HTMLInputElement | null>
  fileInputRef: MutableRefObject<HTMLInputElement | null>
}) => {
  const attach = useUnit($attach)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files

    if (selectedFiles && selectedFiles.length > 0) {
      const maxAllowedSelection = 5
      const currentSelectionCount = attach?.data ? attach.data.length : 0
      const remainingSelectionCount = maxAllowedSelection - currentSelectionCount

      const newSelection = Array.from(selectedFiles)
        .slice(0, remainingSelectionCount)
        .filter((file) => file.size < 30 * 1024 * 1024)

      attachDataChanged(attach?.data ? ([...attach.data, ...newSelection] as File[]) : newSelection)
    } else {
      attachTypeChanged(null)
    }
  }

  function removeMedia(i: number) {
    if (attach?.data) {
      const updatedMedia = [...attach?.data]
      updatedMedia.splice(i, 1)
      attachDataChanged(updatedMedia as File[])
      setHoveredIndex(null)
    }
  }

  return (
    <div className={cl.attach}>
      <input hidden ref={mediaInputRef} type={'file'} onChange={handleFileChange} />
      <input hidden ref={fileInputRef} type={'file'} onChange={handleFileChange} />
      {attach?.type === 'media' && attach.data.length ? (
        <div className={cl.media}>
          {attach.data.map((file, i) => (
            <div
              key={i}
              className={cl.mediaItem}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img className={cl.mediaItemImg} src={URL.createObjectURL(file as Blob)} alt="file" />
              {i === hoveredIndex && (
                <Button extraClass={cl.mediaItemHovered} onClick={() => removeMedia(i)}>
                  <CrossImg className={'blue-stroke-hover'} />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : null}
      {attach?.type === 'file' && attach.data.length ? (
        <div className={cl.media}>
          {attach.data.map((file) => (
            <img src={URL.createObjectURL(file as Blob)} alt="file" />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { ChatFrameAttach }
