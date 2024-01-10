import React from "react";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteCreatable,
    AutoCompleteTag,
    ItemTag,
} from "@choc-ui/chakra-autocomplete";

import { tagColor } from "@/components/ColorfulTag";

// TODO: make those dynamically fetched from server
const existingTags = ["ocean", "python", "data"];

export default function TagInput<T extends FieldValues>({
    control,
    name,
}: {
    control: Control<T>;
    name: Path<T>;
}) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <AutoComplete
                    multiple
                    creatable
                    onChange={(value: string[]) =>
                        value && field.onChange(value)
                    }
                    onBlur={field.onBlur}
                    defaultValues={field.value}
                >
                    <AutoCompleteInput variant="filled">
                        {({ tags }: { tags: ItemTag[] }) =>
                            tags.map((tag, tid) => (
                                <AutoCompleteTag
                                    key={`option-aci-${tid}`}
                                    label={tag.label as string}
                                    colorScheme={tagColor(tag.label as string)}
                                    onRemove={tag.onRemove}
                                />
                            ))
                        }
                    </AutoCompleteInput>
                    <AutoCompleteList>
                        <AutoCompleteCreatable>
                            {({ value }: { value: string }) => (
                                <span>Add {value} to tags</span>
                            )}
                        </AutoCompleteCreatable>
                        {existingTags.map((tag, i) => (
                            <AutoCompleteItem
                                key={`option-item-${i}`}
                                value={tag}
                            >
                                {tag}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>
            )}
        />
    );
}
