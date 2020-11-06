import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import { CANCEL_QUEUE, GET_QUEUES, FETCH_QUEUE, ORDER_FOOD, BOOK_QUEUE, GET_MY_QUEUE } from '../../utils/graphql';
import liffHelper from '../../utils/liffHelper';
import queue_bg from '../../imgs/queue_bg.png'
import queue_bin from '../../imgs/queue_bin.svg'
import kopihub from '../../imgs/queue_kopihub.jpg'
import queue_red_warning from '../../imgs/queue_red_warning.svg'
import queue_seat_decrease from '../../imgs/queue_seat_decrease.svg'
import queue_seat_increase from '../../imgs/queue_seat_increase.svg'
import CustomModal from './CustomModal';
import { Global, css } from '@emotion/core';

let params = new URLSearchParams(decodeURIComponent(window.location.search));
let booked = params.get("booked");

const CustomerQueue = () => {

    const [userId, setUserId]: any = useState();
    const [pictureUrl, setPictureUrl]: any = useState();
    const [displayName, setDisplayName]: any = useState();

    const [cancelQueueVisible, setCancelQueueVisible]: any = useState(false);
    const [cancelQueueId, setCancelQueueId]: any = useState();
    const [cancelQueueNo, setCancelQueueNo]: any = useState();
    const [cancelQueueOrderFoodStatus, setCancelQueueOrderFoodStatus]: any = useState();

    const [bookQueueVisible, setBookQueueVisible]: any = useState(false);
    const [bookQueueName, setBookQueueName]: any = useState();
    const [bookQueueSeat, setBookQueueSeat]: any = useState(2);

    liffHelper.getProfile().then((profile) => {
        setUserId(profile.userId);
        setPictureUrl(profile.pictureUrl)
        setDisplayName(profile.displayName)
    });

    const { data: queuesData, loading: queuesLoading } = useQuery(GET_QUEUES, {
        fetchPolicy: 'no-cache',
        pollInterval: 1000,
        onError: (err) => {
            window.alert(err)
        }
    });

    const { data: myQueueData, loading: myQueueLoading } = useQuery(GET_MY_QUEUE, {
        variables: {
            userId: userId ? userId : '',
        },
        onCompleted: (sre) => {
            if (booked) {
                setBookQueueVisible(!sre.getMyQueue)
            } else {
                setBookQueueVisible(false)
            }
        },
        onError: (err) => {
            window.alert(err)
        }
    });

    const recentQueue = (queuesData && queuesData.getQueues && queuesData.getQueues.recentQueue)
    const activeQueues = (queuesData && queuesData.getQueues && queuesData.getQueues.activeQueues)

    let countA = 0, countB = 0, countC = 0
    if (!userId) {
        return null
    } else {
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
            .my-queue{
                background-color: #FFEED3;
                border: 2px solid #683830;
            }
            .bg-transparent{
                background-color: rgb(255,255,255,0.8)
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
                    font-size: 10em;
                }
            }
            `}
                />

                <CustomModal
                    buttonColor="#FD0F0F"
                    buttonText="ยืนยัน"
                    content={
                        <div className="pt-12 pb-12">
                            <div className="flex justify-center items-center">
                                <div className="mr-12 md:block hidden">
                                    <img className="object-cover rounded-full" src={queue_red_warning} />
                                </div>
                                <div>
                                    <div className="md:hidden mb-1 flex items-center justify-center">
                                        <img className="object-cover rounded-full" src={queue_red_warning} />
                                    </div>
                                    <div className="text-4xl" style={{ color: '#FD0F0F' }}>ยกเลิกคิว{cancelQueueOrderFoodStatus ? 'ไม่ได้' : ''}</div>
                                    <div className="leading-none" style={{ color: '#AE0000', fontSize: '4.5rem' }}>{cancelQueueNo}</div>
                                </div>
                            </div>
                            {cancelQueueOrderFoodStatus ? <div className="md:text-2xl text-base pl-12 pr-12 pt-8" style={{ color: '#FD0F0F' }}>คุณสั่งอาหารไปแล้ว รบกวนแจ้งพนักงานเพื่อขอยกเลิกคิวค่ะ</div> : ''}
                        </div>
                    }
                    visible={cancelQueueVisible}
                    setVisible={setCancelQueueVisible}
                    id={cancelQueueId}
                    disabled={cancelQueueOrderFoodStatus}
                    type='cancel'
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
                                        <input className="md:pl-6 pl-1 md:ml-4 ml-2 w-full md:h-20 h-8" type="input" placeholder="สมชาย" defaultValue={displayName} onChange={(e) => { setBookQueueName(e.target.value) }} style={{ border: '1px solid #585568', borderRadius: '0.25rem' }} />
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
                    name={bookQueueName ? bookQueueName : displayName}
                    userId={userId}
                    pictureUrl={pictureUrl}
                    setBookQueueSeat={setBookQueueSeat}
                    setBookQueueName={setBookQueueName}
                    permanent={true}
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
                                (<div className={`w-full md:p-8 p-4 ${userId && userId === recentQueue.userId ? 'my-queue' : 'bg-white'}`} style={{ borderRadius: '0.5rem' }}>
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
                                                <p className="mb-0 md:text-xl text-xs md:ml-4 ml-2 whitespace-no-wrap" style={{ color: '#585568' }}>หมายเลขคิว</p>
                                            </div>
                                            <p className="mb-0 leading-none recent-queue-queue-no-font-size" style={{ color: '#683830' }}>{recentQueue.queueNo}</p>
                                        </div>
                                    </div>
                                </div>) : ''
                        }

                        <div className="flex flex-wrap mt-6">
                            {
                                activeQueues && activeQueues.map((item: any, index: any) => {
                                    return (
                                        <div key={index} className={`mb-4 ${userId && userId === item.userId ? 'my-queue' : 'bg-transparent'}`} style={index % 2 === 0 ? { borderRadius: '0.5rem', width: '48%', marginRight: '2%' } : { borderRadius: '0.5rem', width: '48%', marginLeft: '2%' }}>
                                            <div className="w-full" style={{ borderBottom: '1px solid rgb(23,23,23,0.1)' }}>
                                                <div className="flex items-center justify-between w-full p-4">
                                                    <div className="flex items-center">
                                                        <img className="object-cover rounded-full" style={{ height: '4em', width: '4em' }} src={`${item.pictureUrl ? item.pictureUrl : kopihub}`} />
                                                        <div className="md:ml-4 ml-2">
                                                            <b className="md:text-base text-xs whitespace-no-wrap" style={{ color: '#683830' }}>คุณ{item && item.name ? item.name : 'ลูกค้า'}</b><br />
                                                            <p className="md:text-sm text-xs mb-0 whitespace-no-wrap" style={{ color: '#585568' }}>จำนวน {item && item.seat} ท่าน</p>
                                                            <div className="pr-4 block md:hidden text-center mt-1">
                                                                {userId && userId === item.userId ?
                                                                    item.ordered ?
                                                                        <div className="p-1 text-xs whitespace-no-wrap" style={{ color: '#088C0D', border: '1px solid #088C0D', borderRadius: '0.5rem' }}>สั่งแล้ว</div> :
                                                                        <div className="p-1 text-xs whitespace-no-wrap" style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่ง</div>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="md:flex items-center hidden">
                                                        <div className="pr-4">
                                                            {item.ordered ?
                                                                <div className="p-1 md:text-xs whitespace-no-wrap" style={{ color: '#088C0D', border: '1px solid #088C0D', borderRadius: '0.5rem' }}>สั่งแล้ว</div> :
                                                                <div className="p-1 md:text-xs whitespace-no-wrap" style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่ง</div>
                                                            }
                                                        </div>
                                                        <img onClick={() => { setCancelQueueId(item && item.id); setCancelQueueNo(item && item.queueNo); setCancelQueueOrderFoodStatus(item && item.ordered); setCancelQueueVisible(true) }} className="object-cover" style={{ width: '2em' }} src={queue_bin} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex pt-4 pb-4">
                                                <div className="text-center w-2/5 pb-2" style={{ borderRight: '2px solid rgb(41,22,19,0.3)' }}>
                                                    <p className="mb-0 md:text-base text-xs whitespace-no-wrap" style={{ color: '#585568' }}>รออีก (คิว)</p>
                                                    <p className="mb-0 leading-none md:text-6xl text-2xl" style={{ color: '#683830' }}>{item.seat < 4 ? ++countA : item.seat < 7 ? ++countB : ++countC}</p>
                                                </div>
                                                <div className="text-center w-3/5 pb-2">
                                                    <p className="mb-0 md:text-base text-xs whitespace-no-wrap" style={{ color: '#585568' }}>หมายเลขคิว</p>
                                                    <p className="mb-0 leading-none md:text-6xl text-2xl" style={{ color: '#683830' }}>{item.queueNo}</p>
                                                </div>
                                            </div>
                                            {
                                                userId && userId === item.userId ?
                                                    <div className="text-white text-center pt-2 pb-2" style={{ backgroundColor: '#683830' }} onClick={() => { setCancelQueueId(item.id); setCancelQueueNo(item.queueNo); setCancelQueueOrderFoodStatus(item.ordered); setCancelQueueVisible(true); }}>
                                                        ยกเลิกคิว
                                                </div>
                                                    : ''
                                            }
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
}
export default CustomerQueue;