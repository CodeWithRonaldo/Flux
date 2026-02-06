import React from 'react'
import styles from './Form.module.css'

const Form = ({title,subtitle, onSubmit, children}) => {
  return (
    <div className={styles.container}>
        <form className={styles.form} onSubmit={onSubmit}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
            {children}
        </form>
    </div>
  )
}

export default Form