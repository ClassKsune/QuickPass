import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
    ButtonStyled,
  DraggableHandleStyled,
  DraggableItemStyled,
} from './DraggableInput.style';
import { IconGripVertical, IconCirclePlus } from '@tabler/icons-react';
import { useListState } from '@mantine/hooks';
import { SocialState } from '@/types/Profile';
import { TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '@/utils';
import { useTranslations } from 'next-intl';

interface DndListHandleProps {
  data: SocialState[];
  setData: (data: SocialState[]) => void;
}

export const Socials = ({ data, setData }: DndListHandleProps) => {
  const t = useTranslations("Profile.socials");
  const [state, handlers] = useListState(data);

  useEffect(() => {
    handlers.setState(data);
  }, [data]);

  const handleAddItem = () => {
    setData([...state, { _id: Date.now().toString(), url: '' }])
  };

  const handleRemoveItem = (id: string) => {
    setData(state.filter((item) => item._id !== id));
  };

  const handleUrlChange = (id: string, url: string) => {
    const index = state.findIndex((item) => item._id === id);
    if (index !== -1) {
      const updatedState = [...state];
      updatedState[index] = { ...state[index], url };
      handlers.setItem(index, updatedState[index]);
      setData(updatedState);
    }
  };

  return (
    <div>
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            if (!destination) return;
            handlers.reorder({ from: source.index, to: destination?.index || 0 })

            const reorderedState = [...state];
            const [movedItem] = reorderedState.splice(source.index, 1);
            reorderedState.splice(destination.index, 0, movedItem);
            setData(reorderedState);
          }}
        >
        <Droppable droppableId='dnd-list' direction='vertical'>
            {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                {state.map((item, index) => (
                <Draggable key={item._id} index={index} draggableId={item._id}>
                    {(provided, snapshot) => (
                    <DraggableItemStyled
                        ref={provided.innerRef}
                        $isDragging={snapshot.isDragging}
                        {...provided.draggableProps}
                    >
                        <TextInput
                          value={item.url}
                          onChange={(e) => handleUrlChange(item._id, e.currentTarget.value)}
                          placeholder={t("placeholder")}
                          style={{ flex: 1 }}
                        />
                        <DraggableHandleStyled {...provided.dragHandleProps}>
                        <IconGripVertical style={{ cursor: 'grab' }} size={32} stroke={1.5} />
                        </DraggableHandleStyled>
                        <FontAwesomeIcon onClick={() => handleRemoveItem(item._id)} style={{ cursor: 'pointer' }} icon={faTrashCan} size="lg" color={Colors.error} />
                    </DraggableItemStyled>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </DragDropContext>
        <ButtonStyled onClick={handleAddItem}>
          <IconCirclePlus size={28} fill={Colors.black} style={{ cursor: 'pointer' }} />
        </ButtonStyled>
    </div>
  );
};
