import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import { CANCEL_QUEUE, GET_QUEUES, FETCH_QUEUE, ORDER_FOOD, BOOK_QUEUE } from '../../utils/graphql';
import queue_bg from '../../imgs/queue_bg.png'
import queue_qr_code from '../../imgs/queue_qr_code.png'
import queue_bin from '../../imgs/queue_bin.svg'
import queue_add from '../../imgs/queue_add.svg'
import queue_red_warning from '../../imgs/queue_red_warning.svg'
import queue_seat_decrease from '../../imgs/queue_seat_decrease.svg'
import queue_seat_increase from '../../imgs/queue_seat_increase.svg'
import CustomModal from './CustomModal';
import { AlertOutlined } from '@ant-design/icons';
import { Global, css } from '@emotion/core';
import kopihub from '../../imgs/queue_kopihub.jpg'
import { Redirect } from 'react-router-dom';

const StaffQueue = () => {

    const { data: queuesData, loading: queuesLoading } = useQuery(GET_QUEUES, {
        fetchPolicy: 'no-cache',
        pollInterval: 1000,
        onError: (err) => {
            window.alert(err)
        }
    });

    const recentQueue = (queuesData && queuesData.getQueues && queuesData.getQueues.recentQueue)
    const activeQueues = (queuesData && queuesData.getQueues && queuesData.getQueues.activeQueues)

    const [userId, setUserId]: any = useState();
    const [fetchQueueVisible, setFetchQueueVisible]: any = useState(false);
    const [recentQueueNo, setRecentQueueNo]: any = useState();

    const [cancelQueueVisible, setCancelQueueVisible]: any = useState(false);
    const [cancelQueueId, setCancelQueueId]: any = useState();
    const [cancelQueueNo, setCancelQueueNo]: any = useState();
    const [cancelQueueOrderFoodStatus, setCancelQueueOrderFoodStatus]: any = useState();

    const [orderFoodVisible, setOrderFoodVisible]: any = useState(false);
    const [orderFoodId, setOrderFoodId]: any = useState();
    const [orderFoodNo, setOrderFoodNo]: any = useState();

    const [bookQueueVisible, setBookQueueVisible]: any = useState(false);
    const [bookQueueName, setBookQueueName]: any = useState();
    const [bookQueueSeat, setBookQueueSeat]: any = useState(2);

    if (!sessionStorage.getItem("loggedUserId")) {
        return <Redirect to={'/'} />
    }
    return (
        <div style={{ touchAction: 'manipulation' }}>
            <Global
                styles={css`
            .recent-queue-profile-img {
                height: 4em;
                width: 4em;
            }
            .recent-queue-queue-no-font-size {
                font-size: 4em;
            }
            .common-queue-no-font-size {
                font-size: 5em;
            }

            @media (min-width:768px) {
                .recent-queue-profile-img {
                    height: 10em;
                    width: 10em;
                }
                .recent-queue-queue-no-font-size {
                    font-size: 7em;
                }
                .common-queue-no-font-size {
                    font-size: 7em;
                }
            }
            `}
            />
            <img src={queue_add} alt="addbtn" className="fixed right-0 bottom-0 w-1/6" onClick={() => { setBookQueueVisible(true) }} />
            <img src={queue_qr_code} alt="qrcode" className="w-full" />

            <CustomModal
                buttonColor="#088C0D"
                buttonText="ได้โต๊ะแล้ว"
                content={
                    <div>
                        <div className="pt-12 pb-12">
                            <div className="text-4xl" style={{ color: '#585568' }}>หมายเลขคิว</div>
                            <div className="leading-none common-queue-no-font-size" style={{ color: '#683830' }}>{recentQueueNo}</div>
                        </div>
                    </div>
                }
                visible={fetchQueueVisible}
                setVisible={setFetchQueueVisible}
                id={activeQueues && activeQueues[0] ? activeQueues[0].id : ''}
                type='fetch'
            />

            <CustomModal
                buttonColor="#FD0F0F"
                buttonText="ยืนยัน"
                content={
                    <div className="pt-12 pb-12">
                        <div className="flex justify-center items-center">
                            <div className="mr-12 hidden md:block">
                                <img className="object-cover rounded-full" src={queue_red_warning} />
                            </div>
                            <div>
                                <div className="md:hidden flex items-center justify-center">
                                    <img className="object-cover rounded-full" src={queue_red_warning} />
                                </div>
                                <div className="text-4xl" style={{ color: '#FD0F0F' }}>ยกเลิกคิว</div>
                                <div className="leading-none" style={{ color: '#AE0000', fontSize: '4.5rem' }}>{cancelQueueNo}</div>
                            </div>
                        </div>
                        {cancelQueueOrderFoodStatus ? <div className="md:text-2xl text-base pl-12 pr-12 pt-8" style={{ color: '#FD0F0F' }}>คิวนี้สั่งอาหารไปแล้ว แจ้งพนักงานเคาน์เตอร์ก่อนกดยกเลิก !!!</div> : ''}
                    </div>
                }
                visible={cancelQueueVisible}
                setVisible={setCancelQueueVisible}
                id={cancelQueueId}
                type='cancel'
            />

            <CustomModal
                buttonColor="#683830"
                buttonText="สั่งอาหารแล้ว"
                content={
                    <div>
                        <div className="pt-12 pb-12">
                            <div className="text-4xl" style={{ color: '#585568' }}>หมายเลขคิว</div>
                            <div className="leading-none common-queue-no-font-size" style={{ color: '#683830' }}>{orderFoodNo}</div>
                        </div>
                    </div>
                }
                visible={orderFoodVisible}
                setVisible={setOrderFoodVisible}
                id={orderFoodId}
                type='order'
            />

            <CustomModal
                buttonColor="#683830"
                buttonText="จองคิว"
                content={
                    <div>
                        <div className="md:pt-12 md:pb-12 pt-4 pb-4 text-center">
                            <div className="md:text-5xl text-3xl md:mb-6 mb-2" style={{ color: '#683830' }}>จองคิว</div>
                            <div className="md:text-4xl text-base md:pl-16 md:pr-16 pl-4 pr-4 pt-4 pb-4 text-left">
                                <div className="flex items-center justify-between md:mb-12 mb-4 w-full">
                                    <p className="mb-0 whitespace-no-wrap">ชื่อ : </p>
                                    <input className="md:pl-6 pl-1 md:ml-4 ml-2 w-full md:h-20 h-8" type="input" placeholder="สมชาย" onChange={(e) => { setBookQueueName(e.target.value) }} style={{ border: '1px solid #585568', borderRadius: '0.25rem' }} />
                                </div>
                                <div>
                                    จำนวน (ท่าน)*
                                    <div className="md:mt-8 mt-4 text-center flex justify-between items-center">
                                        <img className="w-1/6" src={queue_seat_decrease} onClick={() => { if (bookQueueSeat - 1 > 0) { setBookQueueSeat(bookQueueSeat - 1) } }} />
                                        <input className='md:w-56 md:h-32 h-16 w-24 text-center ml-6 mr-6' type="number" value={bookQueueSeat} style={{ border: '1px solid #585568', borderRadius: '0.25rem', fontSize: '2.5em', color: '#683830' }} onChange={(e) => { setBookQueueSeat(parseInt(e.target.value)) }} />
                                        <img className="w-1/6" src={queue_seat_increase} onClick={() => { setBookQueueSeat(bookQueueSeat + 1) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                visible={bookQueueVisible}
                setVisible={setBookQueueVisible}
                type='book'
                seat={bookQueueSeat}
                name={bookQueueName}
                setBookQueueSeat={setBookQueueSeat}
            />

            <div
                className="pt-8 pb-64"
                style={
                    {
                        backgroundColor: '#f8f6f1',
                        backgroundImage: 'url(' + queue_bg + ')',
                        backgroundSize: 'cover',
                        overflow: 'hidden',
                        width: '100vw',
                        minHeight: '100vh'
                    }
                }>
                <div className="md:ml-12 md:mr-12 ml-4 mr-4">
                    {
                        recentQueue ?
                            (<div className="w-full bg-white md:p-8 p-4" style={{ borderRadius: '0.5rem' }}>
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        <img className="object-cover rounded-full recent-queue-profile-img" src={`${recentQueue.pictureUrl ? recentQueue.pictureUrl : kopihub}`} />
                                        <div className="md:ml-6 ml-2">
                                            <b className="md:text-3xl text-base" style={{ color: '#683830' }}>คุณ{recentQueue && recentQueue.name ? recentQueue.name : 'ลูกค้า'}</b><br />
                                            <p className="md:text-xl text-xs mb-0 whitespace-no-wrap" style={{ color: '#585568' }}>จำนวน {recentQueue && recentQueue.seat} ท่าน</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end">
                                            {recentQueue.ordered ?
                                                <div className="p-1 pl-2 pr-2 md:text-base text-xs whitespace-no-wrap" style={{ color: '#088C0D', border: '1px solid #088C0D', borderRadius: '0.5rem' }}>สั่งอาหารแล้ว</div> :
                                                <div className="p-1 pl-2 pr-2 md:text-base text-xs whitespace-no-wrap" onClick={() => { setOrderFoodId(recentQueue && recentQueue.id); setOrderFoodNo(recentQueue && recentQueue.queueNo); setOrderFoodVisible(true) }} style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่งอาหาร</div>
                                            }
                                            <p className="mb-0 md:text-xl text-xs md:ml-4 ml-2 whitespace-no-wrap" style={{ color: '#585568' }}>หมายเลขคิว</p>
                                        </div>
                                        <p className="mb-0 leading-none recent-queue-queue-no-font-size" style={{ color: '#683830' }}>{recentQueue.queueNo}</p>
                                    </div>
                                </div>
                            </div>) : ''
                    }

                    <div className="flex justify-center">
                        <button style={{ backgroundColor: '#683830', borderRadius: '1rem' }} className="text-white text-3xl pt-4 pb-4 pr-8 pl-8 mt-8 mb-8 flex items-center" disabled={activeQueues && activeQueues[0] ? false : true} onClick={() => { setRecentQueueNo(activeQueues && activeQueues[0] ? activeQueues[0].queueNo : ''); setFetchQueueVisible(true); }}>
                            <AlertOutlined className="mr-6" /> เรียกคิว
                        </button>
                    </div>

                    <div className="flex flex-wrap">
                        {
                            activeQueues && activeQueues.map((item: any, index: any) => {
                                return (
                                    <div key={index} className="mb-4" style={index % 2 === 0 ? { borderRadius: '0.5rem', backgroundColor: 'rgb(255,255,255,0.8)', width: '48%', marginRight: '2%' } : { borderRadius: '0.5rem', backgroundColor: 'rgb(255,255,255,0.8)', width: '48%', marginLeft: '2%' }}>
                                        <div className="w-full" style={{ borderBottom: '1px solid rgb(23,23,23,0.1)' }}>
                                            <div className="flex items-center justify-between w-full p-4">
                                                <div className="flex items-center">
                                                    <img className="object-cover rounded-full" style={{ height: '4em', width: '4em' }} src={`${item.pictureUrl ? item.pictureUrl : kopihub}`} />
                                                    <div className="md:ml-4 ml-2">
                                                        <b className="md:text-base text-xs whitespace-no-wrap" style={{ color: '#683830' }}>คุณ{item && item.name ? item.name : 'ลูกค้า'}</b><br />
                                                        <p className="md:text-sm text-xs mb-0 whitespace-no-wrap" style={{ color: '#585568' }}>จำนวน {item && item.seat} ท่าน</p>
                                                        <div className="pr-4 block md:hidden text-center mt-1">
                                                            {item.ordered ?
                                                                <div className="p-1 text-xs whitespace-no-wrap" style={{ color: '#088C0D', border: '1px solid #088C0D', borderRadius: '0.5rem' }}>สั่งแล้ว</div> :
                                                                <div className="p-1 text-xs whitespace-no-wrap" onClick={() => { setOrderFoodId(item && item.id); setOrderFoodNo(item && item.queueNo); setOrderFoodVisible(true) }} style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่ง</div>
                                                            }
                                                            <img onClick={() => { setCancelQueueId(item && item.id); setCancelQueueNo(item && item.queueNo); setCancelQueueOrderFoodStatus(item && item.ordered); setCancelQueueVisible(true) }} className="object-cover mt-1" style={{ width: '2em' }} src={queue_bin} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:flex items-center hidden">
                                                    <div className="pr-4">
                                                        {item.ordered ?
                                                            <div className="p-1 md:text-xs whitespace-no-wrap" style={{ color: '#088C0D', border: '1px solid #088C0D', borderRadius: '0.5rem' }}>สั่งอาหารแล้ว</div> :
                                                            <div className="p-1 md:text-xs whitespace-no-wrap" onClick={() => { setOrderFoodId(item && item.id); setOrderFoodNo(item && item.queueNo); setOrderFoodVisible(true) }} style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่งอาหาร</div>
                                                        }
                                                    </div>
                                                    <img onClick={() => { setCancelQueueId(item && item.id); setCancelQueueNo(item && item.queueNo); setCancelQueueOrderFoodStatus(item && item.ordered); setCancelQueueVisible(true) }} className="object-cover" style={{ width: '2em' }} src={queue_bin} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex pt-4 pb-4">
                                            <div className="text-center w-2/5 pb-2" style={{ borderRight: '2px solid rgb(41,22,19,0.3)' }}>
                                                <p className="mb-0 md:text-base text-xs whitespace-no-wrap" style={{ color: '#585568' }}>รออีก (คิว)</p>
                                                <p className="mb-0 leading-none md:text-6xl text-2xl" style={{ color: '#683830' }}>{index + 1}</p>
                                            </div>
                                            <div className="text-center w-3/5 pb-2">
                                                <p className="mb-0 md:text-base text-xs whitespace-no-wrap" style={{ color: '#585568' }}>หมายเลขคิว</p>
                                                <p className="mb-0 leading-none md:text-6xl text-2xl" style={{ color: '#683830' }}>{item.queueNo}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}
export default StaffQueue;