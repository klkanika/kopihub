import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useRef, useState } from 'react';
import { CANCEL_QUEUE, GET_QUEUES, GET_SUCCESS_QUEUES, FETCH_QUEUE, ORDER_FOOD, BOOK_QUEUE, GET_TABLES } from '../../utils/graphql';
import queue_bg from '../../imgs/queue_bg.png'
import icon_queue from '../../imgs/icon_queue.png'
import queue_qr_code from '../../imgs/queue_qr_code.png'
import queue_bin from '../../imgs/queue_bin.svg'
import queue_add from '../../imgs/queue_add.svg'
import queue_red_warning from '../../imgs/queue_red_warning.svg'
import queue_seat_decrease from '../../imgs/queue_seat_decrease.svg'
import queue_seat_increase from '../../imgs/queue_seat_increase.svg'
import queue_table from '../../imgs/queue_table.svg'
import CustomModal from './CustomModal';
import { AlertOutlined } from '@ant-design/icons';
import { Global, css } from '@emotion/core';
import kopihub from '../../imgs/queue_kopihub.jpg'
import { Redirect } from 'react-router-dom';
import { Dropdown, Menu, Select, Table } from 'antd';
import Header from './Header';
import moment from "moment"
import 'moment/locale/th'
moment.locale("th");


const TableBtn = (props: any) => {
    return (
        <div className={`w-1/6 text-center md:pt-2 md:pb-2 md:text-3xl text-xl mr-1 mb-4 flex justify-center items-center font-bold fetch-btn ${props.selectedTableId === props.id ? 'fetch-btn-clicked' : ''}`} onClick={() => { props.setSelectedTableId(props.id) }}>
            <p className="mb-0">{props.tableName}</p>
        </div>
    )
}

const StaffQueue = () => {

    const startDate = moment().startOf('day').toDate()
    const endDate = moment().endOf('day').toDate()

    const { data: successQueues, loading: successQueuesLoading } = useQuery(GET_SUCCESS_QUEUES, {
        fetchPolicy: 'no-cache',
        variables: {
            startDate: startDate,
            endDate: endDate
        },
        pollInterval: 1000,
        onError: (err) => {
            window.alert(err)
        }
    });

    const { data: queuesData, loading: queuesLoading } = useQuery(GET_QUEUES, {
        fetchPolicy: 'no-cache',
        pollInterval: 1000,
        onError: (err) => {
            window.alert(err)
        }
    });

    const { data: tablesData, loading: tablesLoading } = useQuery(GET_TABLES, {
        fetchPolicy: 'no-cache',
        onError: (err) => {
            window.alert(err)
        }
    });

    const [fetchQueue, { loading: fetchQueueLoading }] = useMutation(FETCH_QUEUE);

    const recentQueue = (queuesData && queuesData.getQueues && queuesData.getQueues.recentQueue)
    const activeQueues = (queuesData && queuesData.getQueues && queuesData.getQueues.activeQueues)

    const [fetchQueueVisible, setFetchQueueVisible]: any = useState(false);
    const [fetchQueueTableA, setFetchQueueTableA]: any = useState();
    const [fetchQueueTableB, setFetchQueueTableB]: any = useState();
    const [fetchQueueTableC, setFetchQueueTableC]: any = useState();
    const [selectedTableId, setSelectedTableId]: any = useState();
    const [selectedQueue, setSelectedQueue]: any = useState();

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

    const [viewTableVisible, setViewTableVisible]: any = useState(false);

    const userName = sessionStorage.getItem("loggedUserName");

    if (!sessionStorage.getItem("loggedUserId")) {
        return <Redirect to={'/'} />
    }

    let countA = 0, countB = 0, countC = 0
    let firstA = activeQueues && activeQueues.filter((q: any) => {
        return q.seat < 4
    })[0]
    let firstB = activeQueues && activeQueues.filter((q: any) => {
        return q.seat > 3 && q.seat < 7
    })[0]
    let firstC = activeQueues && activeQueues.filter((q: any) => {
        return q.seat >= 7
    })[0]

    const setFetchQueueBack = () => {
        setFetchQueueTableA(null)
        setFetchQueueTableB(null)
        setFetchQueueTableC(null)
        setSelectedTableId(null)
        setSelectedQueue(null)
    }

    const dummyTable = (count: any) => {
        for (let i = 0; i < count; i++) {
            return <div className="w-1/6 pt-1 pb-1 text-xl mr-1 mb-8" key={`x${i}`}></div>
        }
    }

    const onFetchQueue = () => {
        if (selectedQueue && selectedTableId) {
            fetchQueue({ variables: { id: parseInt(selectedQueue), tableId: parseInt(selectedTableId) } })
            setFetchQueueBack()
            setFetchQueueVisible(false)
        } else {
            alert('เลือกโต๊ะและคิวก่อนน้าาาาาา')
        }
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
            .queue-box {
                border-radius: 0.5rem;
                background-color: rgb(255,255,255,0.8);
            }
            .gap-left {
                width: 48%;
                margin-right : 2%;
            }
            .gap-right {
                width: 48%;
                margin-left : 2%;
            }
            .fetch-btn {
                border: 2px solid #683830;
                color: #683830;
            }
            .fetch-btn-clicked {
                background-color: #683830;
                color: white;
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
            <img src={queue_add} alt="addbtn" className="fixed right-0 bottom-0 mr-8 mb-4" style={{ width: '12%' }} onClick={() => { setBookQueueVisible(true) }} />
            {/* <img src={queue_add} alt="addbtn" className="fixed left-0 top-0 w-1/6" onClick={() => { setBookQueueVisible(true) }} /> */}

            <CustomModal
                buttonColor="#088C0D"
                buttonText="เรียกคิว"
                content={
                    <div>
                        <div className="md:pt-12 md:pb-12 md:pr-12 md:pl-12 pt-12 pb-12 pr-4 pl-4">
                            <div className="md:text-4xl text-3xl pb-6">เรียกคิว</div>
                            <div className="overflow-y-scroll" style={{ maxHeight: '80vh' }}>
                                <div className="flex justify-between items-center">
                                    <div className="w-1/3" style={{ borderRight: '0.5px solid black' }}>
                                        <p className="mb-0 md:text-base text-xs" style={{ color: '#585568' }}>สำหรับโต๊ะละ <span className="md:inline-block hidden">(รหัสคิว A)</span></p>
                                        <p className="mb-0 md:text-3xl text-base" style={{ color: '#585568' }}>1-3 คน</p>
                                        <div className="mb-0 md:text-base text-xs mt-3 flex justify-center items-center">
                                            <div className="md:mr-4 mr-1">รหัส A ล่าสุด</div>
                                            {firstA ? <img onClick={(e) => { e.stopPropagation(); setCancelQueueId(firstA && firstA.id); setCancelQueueNo(firstA && firstA.queueNo); setCancelQueueOrderFoodStatus(firstA && firstA.ordered); setCancelQueueVisible(true) }} className="object-cover mt-1" style={{ width: '1em' }} src={queue_bin} /> : <></>}
                                        </div>
                                        <p className="mb-0 md:text-3xl text-base" style={{ color: '#683830' }}>{firstA && firstA.queueNo || '-'}</p>
                                        <button className={`md:text-xl text-xs pt-2 pb-2 md:pr-8 md:pl-8 pr-6 pl-6 mt-4 mb-4 text-center fetch-btn ${firstA && firstA.id === selectedQueue ? 'fetch-btn-clicked' : ''}`} onClick={() => { setSelectedQueue(firstA && firstA.id) }} style={{ borderRadius: '0.3rem' }}>
                                            <p className="mb-0">เรียก</p>
                                        </button>
                                    </div>
                                    <div className="w-1/3" style={{ borderRight: '0.5px solid black', borderLeft: '0.5px solid black' }}>
                                        <p className="mb-0 md:text-base text-xs" style={{ color: '#585568' }}>สำหรับโต๊ะละ <span className="md:inline-block hidden">(รหัสคิว B)</span></p>
                                        <p className="mb-0 md:text-3xl text-base" style={{ color: '#585568' }}>4-6 คน</p>
                                        <div className="mb-0 md:text-base text-xs mt-3 flex justify-center items-center">
                                            <div className="md:mr-4 mr-1">รหัส B ล่าสุด</div>
                                            {firstB ? <img onClick={(e) => { e.stopPropagation(); setCancelQueueId(firstB && firstB.id); setCancelQueueNo(firstB && firstB.queueNo); setCancelQueueOrderFoodStatus(firstA && firstA.ordered); setCancelQueueVisible(true) }} className="object-cover mt-1" style={{ width: '1em' }} src={queue_bin} /> : <></>}
                                        </div>
                                        <p className="mb-0 md:text-3xl text-base" style={{ color: '#683830' }}>{firstB && firstB.queueNo || '-'}</p>
                                        <button className={`md:text-xl text-xs pt-2 pb-2 md:pr-8 md:pl-8 pr-6 pl-6 mt-4 mb-4 text-center fetch-btn ${firstB && firstB.id === selectedQueue ? 'fetch-btn-clicked' : ''}`} onClick={() => { setSelectedQueue(firstB && firstB.id) }} style={{ borderRadius: '0.3rem' }}>
                                            <p className="mb-0">เรียก</p>
                                        </button>
                                    </div>
                                    <div className="w-1/3" style={{ borderLeft: '0.5px solid black' }}>
                                        <p className="mb-0 md:text-base text-xs" style={{ color: '#585568' }}>สำหรับโต๊ะละ <span className="md:inline-block hidden">(รหัสคิว C)</span></p>
                                        <p className="mb-0 md:text-3xl text-base" style={{ color: '#585568' }}>7+ คน</p>
                                        <div className="mb-0 md:text-base text-xs mt-3 flex justify-center items-center">
                                            <div className="md:mr-4 mr-1">รหัส C ล่าสุด</div>
                                            {firstC ? <img onClick={(e) => { e.stopPropagation(); setCancelQueueId(firstC && firstC.id); setCancelQueueNo(firstC && firstC.queueNo); setCancelQueueOrderFoodStatus(firstA && firstA.ordered); setCancelQueueVisible(true) }} className="object-cover mt-1" style={{ width: '1em' }} src={queue_bin} /> : <></>}
                                        </div>
                                        <p className="mb-0 md:text-3xl text-base" style={{ color: '#683830' }}>{firstC && firstC.queueNo || '-'}</p>
                                        <button className={`md:text-xl text-xs pt-2 pb-2 md:pr-8 md:pl-8 pr-6 pl-6 mt-4 mb-4 text-center fetch-btn ${firstC && firstC.id === selectedQueue ? 'fetch-btn-clicked' : ''}`} onClick={() => { setSelectedQueue(firstC && firstC.id) }} style={{ borderRadius: '0.3rem' }}>
                                            <p className="mb-0">เรียก</p>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 text-left" style={{ borderTop: '2px solid #683830' }}>
                                    <p className="mb-0 md:text-2xl text-xl">โต๊ะ</p>
                                    <div className="flex justify-between items-center flex-wrap mt-4 w-full">
                                        {tablesData && tablesData.tables && tablesData.tables.map((table: any, idx: any) => {
                                            return <TableBtn tableName={table.tableName} selectedTableId={selectedTableId} setSelectedTableId={setSelectedTableId} key={idx} id={table.id} />
                                        })}
                                        {dummyTable((5 - (tablesData && tablesData.tables && tablesData.tables.length % 5)) % 5)}
                                    </div>
                                </div>
                                <button style={{ backgroundColor: '#683830', borderRadius: '0.5rem' }} className="text-white text-xl pt-3 pb-3 mt-4 w-1/2 text-center" disabled={activeQueues && activeQueues[0] ? false : true} onClick={() => { onFetchQueue() }}>
                                    <p className="mb-0">ตกลง</p>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                visible={fetchQueueVisible}
                setVisible={setFetchQueueVisible}
                id={activeQueues && activeQueues[0] ? activeQueues[0].id : ''}
                type='fetch'
                disabled={true}
                onCancel={setFetchQueueBack}
                allowOnCancel={true}
                width={'90vw'}
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
                allowOnCancel={true}
                onCancel={setFetchQueueBack}
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
                setBookQueueName={setBookQueueName}
            />

            <CustomModal
                content={
                    <div>
                        <div className="md:pt-12 md:pb-12 pt-4 pb-4 text-center overflow-y-scroll" style={{ maxHeight: '90vh' }}>
                            <div className="md:text-3xl text-xl md:mb-6 mb-2" style={{ color: '#683830' }}>ดู โต๊ะ/คิว ล่าสุด</div>
                            <div className="flex justify-center items-center flex-wrap md:ml-20 md:mr-20 ml-8 mr-8">
                                <div className="flex w-full">
                                    <div className="w-1/3 md:text-2xl text-base pt-2 pb-2 flex justify-center text-white" style={{ borderTop: '1px solid black', borderLeft: '1px solid black', borderBottom: '1px solid black', borderRight: '0.5px solid black', backgroundColor: '#683830', borderTopLeftRadius: '0.5rem' }}>
                                        คิว
                                    </div>
                                    <div className="w-1/3 md:text-2xl text-base pt-2 pb-2 flex justify-center text-white" style={{ borderTop: '1px solid black', borderLeft: 'none', borderBottom: '1px solid black', borderRight: 'none', backgroundColor: '#683830' }}>
                                        โต๊ะ
                                    </div>
                                    <div className="w-1/3 md:text-2xl text-base pt-2 pb-2 flex justify-center text-white" style={{ borderTop: '1px solid black', borderLeft: '1px solid black', borderBottom: '1px solid black', borderRight: '1px solid black', backgroundColor: '#683830', borderTopRightRadius: '0.5rem' }}>
                                        เข้าเมื่อ
                                    </div>
                                </div>
                                {successQueues && successQueues.queues && successQueues.queues.map((q: any, idx: any) => {
                                    return (
                                        <div key={idx} className="flex w-full" style={{ color: '#683830' }}>
                                            <div className="w-1/3 md:text-base text-xs pt-2 pb-2 md:pl-6 flex md:justify-start justify-center" style={{ borderLeft: '1px solid black', borderBottom: '1px solid black', borderRight: '0.5px solid black', borderTop: 'none' }}>
                                                {q.queueNo}
                                            </div>
                                            <div className="w-1/3 md:text-base text-xs pt-2 pb-2 md:pl-6 flex md:justify-start justify-center" style={{ borderLeft: 'none', borderBottom: '1px solid black', borderRight: 'none', borderTop: 'none' }}>
                                                {q.table && q.table.ochaTableName}
                                            </div>
                                            <div className="w-1/3 md:text-base text-xs pt-2 pb-2 md:pl-6 flex md:justify-start justify-center" style={{ borderLeft: '0.5px solid black', borderBottom: '1px solid black', borderRight: '1px solid black', borderTop: 'none' }}>
                                                {parseInt(((moment().diff(moment(q.updateAt)) / 1000) / 60).toString())} นาทีก่อน
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }
                visible={viewTableVisible}
                setVisible={setViewTableVisible}
                type='viewTable'
                disabled={true}
            />

            <div
                className="pb-64"
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
                <div className="flex justify-between items-center mt-8 ml-8 mr-8">
                    <Header className="" username={userName ? userName : ''} userRole={"QUEUE"} page="edit" toggleRole={() => { }}></Header>
                </div>
                <div className="flex justify-center pb-12 md:pt-18 pt-8">
                    <img src={queue_qr_code} alt="qrcode" className="md:w-1/4 w-full object-cover" />
                </div>
                <div className="flex justify-center mb-8">
                    <div className="flex bg-white pt-2 pb-2 pr-4 pl-4 md:w-1/4 w-1/2 justify-center items-center" style={{ border: '1px solid #683830', borderRadius: '0.5rem', color: '#683830' }} onClick={() => { setViewTableVisible(true) }}>
                        <img src={queue_table} style={{ width: '25px' }} className="mr-4" /> ดู โต๊ะ/คิว
                    </div>
                </div>
                <div className="md:ml-12 md:mr-12 ml-4 mr-4">
                    {
                        recentQueue ?
                            (<div className="w-full bg-white md:p-8 p-4" style={{ borderRadius: '0.5rem' }} onClick={() => { if (recentQueue && recentQueue.ordered === false) { setOrderFoodId(recentQueue && recentQueue.id); setOrderFoodNo(recentQueue && recentQueue.queueNo); setOrderFoodVisible(true) } }}>
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        <img className="object-cover rounded-full recent-queue-profile-img" src={`${recentQueue.pictureUrl ? recentQueue.pictureUrl : kopihub}`} />
                                        <div className="md:ml-6 ml-2">
                                            <b className="md:text-3xl text-base" style={{ color: '#683830' }}>คุณ{recentQueue && recentQueue.name ? recentQueue.name : 'ลูกค้า'}</b><br />
                                            <p className="md:text-xl text-xs mb-0 whitespace-no-wrap" style={{ color: '#585568' }}>จำนวน {recentQueue && recentQueue.seat} ท่าน</p>
                                            <p className="md:text-xl text-xs mb-0 whitespace-no-wrap font-bold" style={{ color: '#585568' }}>{recentQueue && recentQueue.table.ochaTableName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end">
                                            {recentQueue.ordered ?
                                                <div className="p-1 pl-2 pr-2 md:text-base text-xs whitespace-no-wrap" style={{ color: '#088C0D', border: '1px solid #088C0D', borderRadius: '0.5rem' }}>สั่งแล้ว</div> :
                                                <div className="p-1 pl-2 pr-2 md:text-base text-xs whitespace-no-wrap" style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่ง</div>
                                            }
                                            <p className="mb-0 md:text-xl text-xs md:ml-4 ml-2 whitespace-no-wrap" style={{ color: '#585568' }}>หมายเลขคิว</p>
                                        </div>
                                        <p className="mb-0 leading-none recent-queue-queue-no-font-size" style={{ color: '#683830' }}>{recentQueue.queueNo}</p>
                                    </div>
                                </div>
                            </div>) : ''
                    }

                    <div className="flex justify-center">
                        <button style={{ backgroundColor: '#683830', borderRadius: '1rem' }} className="text-white text-xl pt-3 pb-3 pr-6 pl-6 mt-8 mb-8 flex items-center" disabled={activeQueues && activeQueues[0] ? false : true} onClick={() => { setFetchQueueVisible(true); }}>
                            <AlertOutlined className="mr-4" />
                            <p className="mb-0">เรียกคิว</p>
                        </button>
                    </div>

                    <div className="flex flex-wrap">
                        {
                            activeQueues && activeQueues.map((item: any, index: any) => {
                                return (
                                    <div key={index} className={`mb-4 queue-box ${index % 2 === 0 ? 'gap-left' : 'gap-right'}`} onClick={() => { if (item && item.ordered === false) { setOrderFoodId(item && item.id); setOrderFoodNo(item && item.queueNo); setOrderFoodVisible(true) } }} >
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
                                                                <div className="p-1 text-xs whitespace-no-wrap" style={{ color: '#FD0F0F', border: '1px solid #FD0F0F', borderRadius: '0.5rem' }}>ยังไม่สั่ง</div>
                                                            }
                                                            <img onClick={(e) => { e.stopPropagation(); setCancelQueueId(item && item.id); setCancelQueueNo(item && item.queueNo); setCancelQueueOrderFoodStatus(item && item.ordered); setCancelQueueVisible(true) }} className="object-cover mt-1" style={{ width: '1.5em' }} src={queue_bin} />
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
                                                    <img onClick={(e) => { e.stopPropagation(); setCancelQueueId(item && item.id); setCancelQueueNo(item && item.queueNo); setCancelQueueOrderFoodStatus(item && item.ordered); setCancelQueueVisible(true) }} className="object-cover" style={{ width: '1.5em' }} src={queue_bin} />
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