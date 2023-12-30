"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
    FormErrorMessage,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    Stack,
    Image,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

import TagInput from "./tagInput";

import Notebook from "@/definitions/Notebook";
import { FileType } from "@/definitions/FileType";
import FileUploader from "./fileUploader";

interface NotebookEditForm {
    title: string;
    tags: string[];
    image?: string;
    author?: string;
}

export default function NotebookDetailsEdit({
    onSubmit,
    onReset,
    notebook,
}: {
    notebook: Notebook;
    onSubmit: (notebook: Notebook) => Promise<void>;
    onReset: () => void;
}) {
    const {
        handleSubmit,
        control,
        register,
        formState: { errors, isSubmitting },
    } = useForm<NotebookEditForm>({
        defaultValues: notebook,
    });

    const onFormSubmit: SubmitHandler<NotebookEditForm> = (updatedValues) =>
        onSubmit({
            ...notebook,
            ...updatedValues,
        });

    // TODO: validation with yup or something...
    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onFormSubmit)}>
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

                <FormControl>
                    <FormLabel>Hero image</FormLabel>
                    <Controller
                        control={control}
                        name="image"
                        render={({ field }) => (
                            <FileUploader
                                maxSize={2 * 1000 * 1000}
                                fileType="image"
                                primaryColor={"red.400"}
                                secondaryColor={"gray.100"}
                                backgroundColor={"white"}
                                showOver={true}
                                onUploadStart={() => {}}
                                preview={
                                    field.value ? (
                                        <Image
                                            alt="Notebook preview image"
                                            src={field.value}
                                        />
                                    ) : (
                                        <StarIcon />
                                    )
                                }
                                onUploadEnd={(uploadedFiles: FileType[]) => {
                                    console.log(
                                        "image upload ended",
                                        uploadedFiles,
                                    );
                                    if (uploadedFiles.length > 0) {
                                        field.onChange &&
                                            field.onChange(
                                                uploadedFiles[0].data?.toString(),
                                            );
                                    }
                                }}
                            />
                        )}
                    />
                    <FormErrorMessage>
                        {errors.image && errors.image.message}
                    </FormErrorMessage>
                </FormControl>

                <Flex align="center" justify="center" direction="column">
                    <FormControl>
                        <FormLabel>Notebook Tags</FormLabel>
                        <TagInput control={control} name="tags" />
                        <FormErrorMessage>
                            {errors.tags && errors.tags.message}
                        </FormErrorMessage>
                    </FormControl>
                </Flex>

                <ButtonGroup gap="2">
                    <Button
                        flex={1}
                        colorScheme="purple"
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                        loadingText="Uploading"
                        type="submit"
                    >
                        Save & Upload
                    </Button>
                    <Button onClick={onReset}>Back</Button>
                </ButtonGroup>
            </Stack>
        </form>
    );
}
