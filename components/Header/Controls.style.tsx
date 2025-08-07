import styled from 'styled-components';
import { Select } from '@mantine/core';
import { Colors } from '@/utils';

export const ControlsWrapper = styled.div`
  display: flex;
  column-gap: 12px;

  label {
    display: none;
  }
`;

export const CartWrapper = styled.div<{ $empty: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: ${Colors.grey};
  padding-inline: 8px;
  border-radius: 6px;
  cursor: pointer;

  span {
    display: none;
  }

  &::before {
    position: absolute;
    content: '';
    right: -4px;
    top: -4px;
    width: 12px;
    height: 12px;
    background-color: ${Colors.error};
    border-radius: 50%;
    pointer-events: none;
    opacity: ${({ $empty }) => ($empty ? 0 : 1)};
  }
`;

export const SelectStyled = styled(Select).attrs({
  styles: {
    input: {
      borderRadius: '10px',
      backgroundColor: Colors.black,
      color: Colors.white,
      width: '70px',
    },
    dropdown: {
      backgroundColor: Colors.black,
      color: Colors.white,
      borderRadius: '10px',
    },
  },
})`
  svg {
    color: ${Colors.white};
  }
`;

export const AccountWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const AccountContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  flex-direction: column;
  top: 48px;
  left: 0;
  right: 0;
  background-color: ${Colors.white};
  border-radius: 10px;
  border: 1px solid ${Colors.grey};
  overflow: hidden;
  text-align: center;
  z-index: 6;

  span {
    color: red;
  }

  & > * {
    height: 32px;
    line-height: 32px;
    width: 100%;
    border-radius: 0;
  }

  & > *:hover {
    background-color: ${Colors.grey};
  }
`;
