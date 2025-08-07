import { Colors } from '@/utils';
import { Button as MantineButton } from '@mantine/core';
import styled from 'styled-components';

export enum ButtonVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    LIGHT = 'light',
    OUTLINE = 'outline',
    ERROR = "error",
}

export enum ButtonSize {
    xs = 'xs',
    sm = 'sm',
    md = 'md',
    lg = 'lg',
}

type ButtonProps = {
    loading?: boolean;
    type?: "button" | "submit";
    variant: ButtonVariant;
    size: ButtonSize;
    label: string;
    onClick?: () => void;
    rightSection?: React.ReactNode;
    disabled?: boolean;
}

export const Button = ({ onClick = () => {}, type = "button", variant, size, label, rightSection, loading, disabled = false }: ButtonProps) => {
    return (
        <StyledButton onClick={onClick} type={type} size={size} variant={variant} rightSection={rightSection} loading={loading} disabled={disabled}>
            {label}
        </StyledButton>
    );
};

const StyledButton = styled(MantineButton<"button">)<{ variant: ButtonVariant }>`
  border-radius: 10px;

  &[data-variant="primary"] {
    background-color: ${Colors.primary};
    color: ${Colors.black};
  }
  &[data-variant="secondary"] {
    background-color: ${Colors.secondary};
    color: ${Colors.white};
  }
  &[data-variant="success"] {
    background-color: ${Colors.success};
    color: ${Colors.white};
  }
  &[data-variant="light"] {
    background-color: ${Colors.white};
    color: ${Colors.black};
  }
  &[data-variant="outline"] {
    background-color: ${Colors.white};
    border: 1px solid ${Colors.black};
    color: ${Colors.black};
  }
  &[data-variant="error"] {
    background-color: ${Colors.error};
    color: ${Colors.white};
  }
`;