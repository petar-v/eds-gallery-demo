"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
    FormErrorMessage,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Flex,
    Stack,
} from "@chakra-ui/react";

import TagInput from "./tagInput";

import Notebook from "@/definitions/Notebook";

interface NotebookEditForm {
    title: string;
    author: string;
    tags: string[];
}

export default function NotebookDetailsEdit({
    upload,
    notebook,
}: {
    notebook: Notebook;
    upload: (notebook: Notebook) => Promise<{ success: boolean }>;
}) {
    const {
        handleSubmit,
        control,
        register,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<NotebookEditForm>({
        defaultValues: notebook,
    });

    const toast = useToast();

    const onSubmit: SubmitHandler<NotebookEditForm> = () => {
        const updatedNotebook = {
            ...notebook,
            // TODO: add values
        };
        upload(updatedNotebook).then((resp) => {
            console.log(`Upload success: ${resp.success}`);
            toast({
                title: "Upload successful.",
                description:
                    "The files you uploaded have been stored successfully and are now in the Gallery.",
                position: "top",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input {...register("title")} />
                    <FormErrorMessage>
                        {errors.title && errors.title.message}
                    </FormErrorMessage>
                </FormControl>

                <FormControl>
                    <FormLabel>Author</FormLabel>
                    <Input {...register("author")} />
                    <FormErrorMessage>
                        {errors.author && errors.author.message}
                    </FormErrorMessage>
                </FormControl>

                <Flex justify="center" align="center" direction="column">
                    <FormControl>
                        <FormLabel>Notebook Tags</FormLabel>
                        <TagInput control={control} name="tags" />
                    </FormControl>
                </Flex>

                <ButtonGroup gap="2">
                    <Button
                        colorScheme="purple"
                        flex={1}
                        type="submit"
                        loadingText="Uploading"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        Save & Upload
                    </Button>
                    <Button
                        onClick={() => {
                            alert(JSON.stringify(getValues()));
                        }}
                    >
                        Back
                    </Button>
                </ButtonGroup>
            </Stack>
        </form>
    );
}
