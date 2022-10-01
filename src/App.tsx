import css from './css/main.module.scss'
import { useEffect, useMemo, useState } from 'react'
import { Button } from './components/button'
import { Slider } from './components/slider'
import { NumericFormat } from 'react-number-format'
import { clamp, useScreenWidth } from './utils'
import clsx from 'clsx'

const MIN_CAR_PRICE = 1_000_000
const MAX_CAR_PRICE = 6_000_000
const MIN_LEASE_TERM = 1
const MAX_LEASE_TERM = 60

function format(value: number) {
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function App() {
    const [carPrice, setCarPrice] = useState(3_300_000)
    const [initialPayment, setInitialPayment] = useState(420_000)
    const [leaseTerm, setLeaseTerm] = useState(60)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const minInitialPayment = carPrice * 0.1
    const maxInitialPayment = carPrice * 0.6

    const monthPay =
        (carPrice - initialPayment) *
        ((0.035 * Math.pow(1 + 0.035, leaseTerm)) /
            (Math.pow(1 + 0.035, leaseTerm) - 1))

    const width = useScreenWidth()
    const small = width <= 768
    const wide = width >= 1440

    async function onSubmit() {
        setIsSubmitting(true)

        try {
            const resp = await fetch('https://eoj3r7f3r4ef6v4.m.pipedream.net', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    carPrice,
                    initialPayment,
                    leaseTerm,
                })
            })
            const result = await resp.text()
            console.log(resp, result)
            if (resp.ok) {
                alert('Успешно отправлено')
            } else {
                alert('Ошибка отправки: HTTP ' + resp.status + '\n' + result)
            }
        } catch (e) {
            alert('Ошибка отправки: ' + e)
        }

        setIsSubmitting(false)
    }

    const submit = (
        <Button
            className={css.send_button}
            text="Оставить заявку"
            onClick={onSubmit}
            loading={isSubmitting}
        />
    )

    return (
        <div className={css.app}>
            <h1 className={css.title}>
                Рассчитайте стоимость автомобиля в лизинг
            </h1>
            <div className={css.line}>
                <div className={css.group}>
                    <h2 className={css.group_title}>Стоимость автомобиля</h2>
                    <Slider
                        value={carPrice}
                        onChange={setCarPrice}
                        min={MIN_CAR_PRICE}
                        max={MAX_CAR_PRICE}
                        end={<span className={css.slider_suffix}>₽</span>}
                        small={small}
                    />
                </div>
                <div className={css.group}>
                    <h2 className={css.group_title}>Первоначальный взнос</h2>
                    <Slider
                        value={initialPayment}
                        onChange={setInitialPayment}
                        min={minInitialPayment}
                        max={maxInitialPayment}
                        end={
                            <span className={css.slider_suffix_box}>
                                {clamp(
                                    Math.round(
                                        (initialPayment / carPrice) * 100
                                    ),
                                    10,
                                    60
                                )}{' '}
                                %
                            </span>
                        }
                        small={small}
                    />
                </div>
                <div className={css.group}>
                    <h2 className={css.group_title}>Срок лизинга</h2>
                    <Slider
                        value={leaseTerm}
                        onChange={setLeaseTerm}
                        min={MIN_LEASE_TERM}
                        max={MAX_LEASE_TERM}
                        end={<span className={css.slider_suffix}>мес.</span>}
                        small={small}
                    />
                </div>
            </div>
            <div className={css.results_line}>
                <div className={css.group}>
                    <h2 className={css.group_title}>Сумма договора лизинга</h2>
                    <div className={css.result}>
                        {format(initialPayment + monthPay * leaseTerm)} ₽
                    </div>
                </div>
                <div className={css.group}>
                    <h2 className={css.group_title}>Ежемесячный платеж от</h2>
                    <div className={css.result}>{format(monthPay)} ₽</div>
                </div>
                {wide && (
                    <div className={clsx(css.group, css.send_wrap_wide)}>
                        {submit}
                    </div>
                )}
            </div>
            {!wide && <div>{submit}</div>}
        </div>
    )
}

export default App
