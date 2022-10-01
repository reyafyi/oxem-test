import css from './slider.module.scss'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { clamp } from '../utils'
import clsx from "clsx";

export interface SliderProps {
    value: number
    min: number
    max: number

    suffix?: string
    end?: JSX.Element
    onChange?: (value: number) => void
    small?: boolean
}

export function Slider(props: SliderProps) {
    return (
        <div className={clsx(css.slider_container, props.small && css.small)}>
            <NumericFormat
                className={css.text_input}
                value={props.value}
                thousandSeparator=" "
                suffix={props.suffix}
                onValueChange={(values) => {
                    const value = clamp(
                        Number(values.floatValue),
                        props.min,
                        props.max
                    )
                    props.onChange?.(value)
                }}
                allowNegative={false}
            />

            {props.end}

            <input
                className={css.slider_input}
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                style={
                    {
                        '--percentage': `${
                            clamp(
                                (props.value - props.min) / (props.max - props.min),
                                0,
                                1
                            ) * 100
                        }%`,
                    } as any
                }
                onInput={(e) => {
                    const value = clamp(
                        Number((e.target as HTMLInputElement).value),
                        props.min,
                        props.max
                    )
                    props.onChange?.(value)
                }}
            />
        </div>
    )
}
