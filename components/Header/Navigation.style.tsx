import { Colors } from '@/utils';
import styled from 'styled-components';

export const NavigationWrapper = styled.nav`
    display: flex;
    white-space: nowrap;

    a:hover {
        color: ${Colors.secondary};
    }
`
