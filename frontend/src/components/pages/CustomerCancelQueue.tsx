import { useQuery } from '@apollo/react-hooks';
import liff from '@line/liff/dist/lib';
import { Modal } from 'antd';
import React, { useState } from 'react';
import queue_red_warning from '../../imgs/queue_red_warning.svg'
import { GET_QUEUE } from '../../utils/graphql';
import liffHelper from '../../utils/liffHelper';
import CustomModal from './CustomModal';

let params = new URLSearchParams(decodeURIComponent(window.location.search));
let queueId = params.get("id");

const CustomerCancelQueue = (props: any) => {

    const [visible, setVisible] = useState(true)
    const [userId, setUserId] = useState(true)

    liffHelper.getProfile().then((profile) => {
        setUserId(profile.userId);
    });

    const { data: queueData, loading: queueLoading } = useQuery(GET_QUEUE, {
        fetchPolicy: 'no-cache',
        variables: {
            id: queueId ? parseInt(queueId) : 0
        },
        onError: (err) => {
            window.alert(err)
        }
    });

    const queue = queueData && queueData.queues[0]

    const setCancelQueueVisible = () => {
        setVisible(false)
        Modal.success({
            content: `ยกเลิกคิว ${queue && queue.queueNo} เรียบร้อยแล้ว`,
            onOk: () => { liffHelper.closeWindow() }
        });
    }

    if (queue) {
        if (queue && queue.status != 'ACTIVE') {
            if (queue.status === 'CANCELLED') {
                Modal.error({
                    content: `คุณยกเลิกคิวนี้ไปแล้ว`,
                    onOk: () => { liffHelper.closeWindow() }
                });
            } else {
                Modal.error({
                    content: `ไม่สามารถยกเลิกคิวนี้ได้ เนื่องจากคิวนี้ถูกเรียกแล้ว`,
                    onOk: () => { liffHelper.closeWindow() }
                });
            }
        } else {
            if (queue && queue.userId != userId) {
                Modal.error({
                    content: `ไม่สามารถยกเลิกคิวนี้ได้ เพราะคิวนี้ไม่ใช่คิวของคุณ`,
                    onOk: () => { liffHelper.closeWindow() }
                });
            } else {
                return <CustomModal
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
                                    <div className="text-4xl" style={{ color: '#FD0F0F' }}>ยกเลิกคิว {queue && queue.ordered ? 'ไม่ได้' : ''}</div>
                                    <div className="leading-none" style={{ color: '#AE0000', fontSize: '4.5rem' }}>{queue && queue.queueNo}</div>
                                </div>
                            </div>
                            {queue && queue.ordered ? <div className="md:text-2xl text-base pl-12 pr-12 pt-8" style={{ color: '#FD0F0F' }}>คุณสั่งอาหารไปแล้ว รบกวนแจ้งพนักงานเพื่อขอยกเลิกคิวค่ะ</div> : ''}
                        </div>
                    }
                    visible={visible}
                    setVisible={setCancelQueueVisible}
                    id={queueId}
                    disabled={queue && queue.ordered}
                    type='cancel'
                />
            }
        }
    } else {
        return null
    }
}
export default CustomerCancelQueue;