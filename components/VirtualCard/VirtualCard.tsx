import { VirtualCardBgStyled, VirtualCardSvgStyled, VirtualCardWrapperStyled } from "./VirtualCard.style"

export const VirtualCard = ({ virtualCard }: any) => {
    return (
        <VirtualCardWrapperStyled>
            <VirtualCardSvgStyled src={virtualCard.url} height={150} width={200} alt={virtualCard.url} />
            <VirtualCardBgStyled src={`/images/${virtualCard.variant}.png`} height={150} width={200} alt={virtualCard.variant} />
        </VirtualCardWrapperStyled>
    )
}