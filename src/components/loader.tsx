import css from './loader.module.scss'

export interface LoaderProps {
    size?: number
}

export function Loader(props: LoaderProps) {
    return (
        <span
            className={css.loader}
            style={{
                width: `${props.size ?? 24}px`,
                height: `${props.size ?? 24}px`,
            }}
        />
    )
}
