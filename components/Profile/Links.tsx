import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
    ButtonStyled,
  DraggableHandleStyled,
  DraggableItemStyled,
} from './DraggableInput.style';
import { IconCirclePlus, IconGripVertical } from '@tabler/icons-react';
import { useListState } from '@mantine/hooks';
import { LinkState } from '@/types/Profile';
import { TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { BorderRadius, Colors, Spacing } from '@/utils';
import styled from 'styled-components';
import { UploadButtonWithLabel } from './UploadButtonWithLabel';
import { useTranslations } from 'next-intl';

interface DndListHandleProps {
  data: LinkState[];
  setData: (data: LinkState[]) => void;
}

export const Links = ({ data, setData }: DndListHandleProps) => {
  const t = useTranslations("Profile.links");
  const [state, handlers] = useListState(data);

  useEffect(() => {
    handlers.setState(data);
  }, [data]);

  const handleAddItem = () => {
    setData([...state, { _id: Date.now().toString(), url: '', name: '', description: '', iconUrl: '' }])
  };

  const handleRemoveItem = (id: string) => {
    setData(state.filter((item) => item._id !== id));
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    const index = state.findIndex((item) => item._id === id);
    if (index !== -1) {
      const updatedState = [...state];
      updatedState[index] = { ...state[index], [field]: value };
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
                    <DraggableItemReStyled
                        ref={provided.innerRef}
                        $isDragging={snapshot.isDragging}
                        {...provided.draggableProps}
                    >
                        <ItemInnerWrapperStyled>
                          <TextInput
                            label={t("name")}
                            value={item.name}
                            onChange={(e) => handleItemChange(item._id, "name", e.currentTarget.value)}
                            placeholder={t("namePlaceholder")}
                            style={{ flex: 1 }}
                          />
                          <TextInput
                            label={t("desc")}
                            value={item.description}
                            onChange={(e) => handleItemChange(item._id, "description", e.currentTarget.value)}
                            placeholder={t("descPlaceholder")}
                            style={{ flex: 1 }}
                          />
                        </ItemInnerWrapperStyled>
                        <ItemInnerWrapperStyled>
                          <UploadButtonWithLabel label="Icon" onUpload={(res) => handleItemChange(item._id, "iconUrl", res[0].url)} />
                          <TextInput
                            label={t("url")}
                            value={item.url}
                            onChange={(e) => handleItemChange(item._id, "url", e.currentTarget.value)}
                            placeholder={t("urlPlaceholder")}
                            style={{ flex: 1 }}
                          />
                        </ItemInnerWrapperStyled>
                        <ItemButtonWrapperStyled>
                          <DraggableHandleStyled {...provided.dragHandleProps}>
                            <IconGripVertical style={{ cursor: 'grab' }} size={32} stroke={1.5} />
                          </DraggableHandleStyled>
                          <FontAwesomeIcon onClick={() => handleRemoveItem(item._id)} style={{ cursor: 'pointer' }} icon={faTrashCan} size="lg" color={Colors.error} />
                        </ItemButtonWrapperStyled>
                    </DraggableItemReStyled>
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

const DraggableItemReStyled = styled(DraggableItemStyled)`
  flex-direction: column;
  background-color: ${Colors.secondary};
  padding: ${Spacing.xs} ${Spacing.sm};
  border-radius: ${BorderRadius.sm};
  row-gap: ${Spacing.xs};
  color: ${Colors.white};
`

const ItemInnerWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  column-gap: ${Spacing.md};

  label {
    padding-left: ${Spacing.sm};
    font-weight: 500;
  }
`

const ItemButtonWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  column-gap: ${Spacing.xs};

  & > div {
    padding: 0;
  }

  svg:first-child {
    color: ${Colors.white};
  }
`
