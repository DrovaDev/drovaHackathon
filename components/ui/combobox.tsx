"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

function Combobox<Value>({
  items,
  value,
  defaultValue,
  onValueChange,
  itemToStringLabel,
  isItemEqualToValue,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  name,
  children,
}: React.PropsWithChildren<{
  items?: readonly Value[]
  value?: Value | null
  defaultValue?: Value | null
  onValueChange?: (value: Value | null, eventDetails: unknown) => void
  itemToStringLabel?: (item: Value) => string
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, eventDetails: unknown) => void
  disabled?: boolean
  name?: string
}>) {
  return (
    <ComboboxPrimitive.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      itemToStringLabel={itemToStringLabel}
      isItemEqualToValue={isItemEqualToValue}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      name={name}
    >
      {children}
    </ComboboxPrimitive.Root>
  )
}

function ComboboxInputGroup({
  className,
  children,
  ...props
}: ComboboxPrimitive.InputGroup.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-lg border border-input bg-silver-two px-2.5 group focus-within:ring-3 focus-within:ring-secondary/20 focus-within:border-secondary transition-all",
        className
      )}
      {...props}
    >
      <SearchIcon className="size-4 text-muted-foreground shrink-0" />
      {children}
      <ChevronDownIcon className="size-4 text-muted-foreground shrink-0 group-data-open:rotate-180 transition-transform" />
    </ComboboxPrimitive.InputGroup>
  )
}

function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "h-full w-full min-w-0 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground placeholder:font-normal outline-none",
        className
      )}
      {...props}
    />
  )
}

function ComboboxPopup({ className, ...props }: ComboboxPrimitive.Popup.Props) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner className="z-50" sideOffset={4}>
        <ComboboxPrimitive.Popup
          data-slot="combobox-popup"
          className={cn(
            "min-w-(--anchor-width) max-h-64 overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-popover p-1 shadow-lg shadow-primary/5 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 origin-(--transform-origin)",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("px-3 py-6 text-center text-xs text-muted-foreground font-medium empty:m-0 empty:p-0", className)}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center rounded-md py-2 pr-8 pl-8 text-sm outline-none select-none data-highlighted:bg-silver-two data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator className="absolute left-2.5 flex items-center justify-center">
        <CheckIcon className="size-4 text-secondary" />
      </ComboboxPrimitive.ItemIndicator>
      {children}
    </ComboboxPrimitive.Item>
  )
}

export {
  Combobox,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxPopup,
  ComboboxList,
  ComboboxEmpty,
  ComboboxItem,
}
