import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ButtonStyled, DraggableHandleStyled, DraggableItemStyled } from './DraggableInput.style';
import { IconGripVertical, IconCirclePlus } from '@tabler/icons-react';
import { useListState } from '@mantine/hooks';
import { TextInput, NumberInput } from '@mantine/core';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Colors as UIColors } from '@/utils';
import { useTranslations } from 'next-intl';

interface ColorState {
  _id: string;
  accentColor: string;
  background: number;
}

interface DndListHandleProps {
  data: ColorState[];
  setData: (data: ColorState[]) => void;
}

export const Colorss = ({ data, setData }: DndListHandleProps) => {
  const t = useTranslations("Profile.colors");
  const [state, handlers] = useListState(data);

  useEffect(() => {
    handlers.setState(data);
  }, [data]);

  const handleAddItem = () => {
    setData([...state, { _id: Date.now().toString(), accentColor: '#FFFFFF', background: 0 }])
  };

  const handleChange = (id: string, field: keyof ColorState, value: string | number) => {
    const index = state.findIndex((item) => item._id === id);
    if (index !== -1) {
      const updatedState = [...state];
      updatedState[index] = { ...state[index], [field]: value };
      handlers.setItem(index, updatedState[index]);
      setData(updatedState);
    }
  };

  const handleRemoveItem = (id: string) => {
    setData(state.filter((item) => item._id !== id));
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
        <Droppable droppableId='colors-list' direction='vertical'>
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
                        value={item.accentColor}
                        onChange={(e) => handleChange(item._id, "accentColor", e.currentTarget.value)}
                        placeholder="#FFFFFF"
                        style={{ flex: 1 }}
                      />
                      <NumberInput
                        value={item.background}
                        onChange={(value) => handleChange(item._id, "background", value || 0)}
                        style={{ width: 80, marginLeft: 8 }}
                      />
                      <DraggableHandleStyled {...provided.dragHandleProps}>
                        <IconGripVertical style={{ cursor: 'grab' }} size={32} stroke={1.5} />
                      </DraggableHandleStyled>
                      <FontAwesomeIcon onClick={() => handleRemoveItem(item._id)} style={{ cursor: 'pointer' }} icon={faTrashCan} size="lg" color={UIColors.error} />
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
        <IconCirclePlus size={28} fill={UIColors.black} style={{ cursor: 'pointer' }} />
      </ButtonStyled>
    </div>
  );
};
