import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { BOOK_QUEUE, CANCEL_QUEUE, FETCH_QUEUE, ORDER_FOOD } from '../../utils/graphql';
import { CloseOutlined } from '@ant-design/icons';
import { css, Global } from '@emotion/core';
import liffHelper from '../../utils/liffHelper';

const CustomModal = (props: any) => {

    // const [fetchQueue, { loading: fetchQueueLoading }] = useMutation(FETCH_QUEUE);
    const [cancelQueue, { loading: cancelQueueLoading }] = useMutation(CANCEL_QUEUE);
    const [orderFood, { loading: orderFoodLoading }] = useMutation(ORDER_FOOD);
    const [bookQueue, { loading: bookQueueLoading }] = useMutation(BOOK_QUEUE);

    const insistEvent = async () => {
        if (props && props.type === 'fetch') {
            // await fetchQueue({ variables: { id: props.id } })
        } else if (props && props.type === 'cancel') {
            if (!cancelQueueLoading) {
                await cancelQueue({ variables: { id: parseInt(props.id) } })
            }
        } else if (props && props.type === 'order') {
            if (!orderFoodLoading) {
                await orderFood({ variables: { id: parseInt(props.id) } })
            }
        } else {
            if (!bookQueueLoading) {
                await bookQueue({ variables: { seat: props.seat, name: props.name, userId: props.userId, pictureUrl: props.pictureUrl } })

                if (props.setBookQueueSeat) {
                    props.setBookQueueSeat(2)
                    props.setBookQueueName('')
                }
            }
        }
        props.setVisible(false)
    }
    if (props.visible) {
        return (
            <>
                <Global
                    styles={css`
                        .popup-width{
                            width: 90vw
                        }

                        @media (min-width:768px) {
                            .popup-width{
                                width: 70vw
                            }
                        }
            `}
                />
                <div className="fixed w-full h-full top-0 right-0 flex justify-center items-center" style={{ backgroundColor: 'rgb(0,0,0,0.3)' }} onClick={() => { if (!props.permanent) { props.setVisible(false); if (props.setBookQueueSeat) { props.setBookQueueSeat(2); } } }}>
                    <div className="bg-white text-center relative popup-width" style={{ borderRadius: '0.5rem' }} onClick={(e) => { e.stopPropagation() }}>
                        {props.permanent ? '' : <div className="absolute right-0 top-0 pt-2 pr-2"><CloseOutlined onClick={() => { props.setVisible(false); if (props.setBookQueueSeat) { props.setBookQueueSeat(2); } }} style={{ fontSize: '3em' }} /></div>}
                        {props.content}
                        <div className={`flex justify-center text-white text-4xl pt-6 pb-6 ${props.disabled ? 'hidden' : ''}`} onClick={() => { insistEvent() }} style={{ backgroundColor: `${props.buttonColor}`, borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                            {props.buttonText}
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return null
    }
}
export default CustomModal;