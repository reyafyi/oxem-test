import css from './button.module.scss'
import { Loader } from './loader'
import clsx from 'clsx'

export interface ButtonProps {
    className?: string
    text: string
    disabled?: boolean
    loading?: boolean
    onClick?: () => void
}

export function Button(props: ButtonProps) {
    return (
        <button
            className={clsx(css.button, props.loading && css.loading, props.className)}
            disabled={props.disabled || props.loading}
            onClick={
                props.loading || props.disabled ? undefined : props.onClick
            }
        >
            {props.text}
            {props.loading && (
                <div className={css.loading_overlay}>
                    <Loader size={21} />
                </div>
            )}
        </button>
    )
}
