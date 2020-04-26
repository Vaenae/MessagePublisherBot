import React, { Fragment } from 'react'
import styles from './Card.module.scss'

export interface CardProps {
    children?: JSX.Element | string
    footer?: JSX.Element | string
}

export function Card(props: CardProps) {
    return (
        <Fragment>
            <div className={styles.card}>
                <div className={styles['card-content']}>
                    <div className={styles.content}>
                        <p className={styles.title}>{props.children}</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
