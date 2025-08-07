import { BorderRadius, Colors } from "@/utils"
import { UploadButton } from "@/utils/uploadThing"
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Flex } from "@mantine/core"
import styled from "styled-components"

export const UploadButtonWithLabel = ({ label, onUpload }: { label: string, onUpload: (res: { url: string }[]) => Promise<void> | void }) => {
    return (
        <UploadWrapper>
            <label className="mantine-InputWrapper-label mantine-FileInput-label">{label}</label>
            <ButtonWrapper>
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={onUpload}
                    content={{
                        button: ({ ready, isUploading }) => {
                            if (!ready) return "Preparing ..."
                            if (isUploading) return "Uploading ..."
                            return <FontAwesomeIcon icon={faCloudUpload} size="lg" color={Colors.black} />
                        },
                        allowedContent: () => '',
                    }}
                />
            </ButtonWrapper>
        </UploadWrapper>
    )
}

const UploadWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    & > div {
        place-self: center;

        label {
            cursor: pointer;
        }
    }

    label {
        font-weight: 500;
        font-size: 14px;
        padding-bottom: 3px;
    }
`

const ButtonWrapper = styled(Flex)`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${BorderRadius.sm};
    background-color: ${Colors.white};
    height: 36px;
    min-width: 64px;

    & > div {
        width: 40px;
    }
`
