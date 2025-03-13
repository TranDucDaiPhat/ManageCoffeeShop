import { useState } from 'react';
import clsx from 'clsx';
import styles from './Customer.module.css'
import { Sidebar } from '../../components';


function Customer() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    const handleRowClick = (customer) => {
        setSelectedCustomer(customer);
        setName(customer.name)
        setPhone(customer.phone)
    };

    const customers = [
        { id: 1, phone: '0987654321', name: 'Nguyễn Văn A' },
        { id: 2, phone: '0912345678', name: 'Trần Thị B' },
        { id: 3, phone: '0909876543', name: 'Lê Văn C' },
        { id: 4, phone: '0909876543', name: 'Lê Văn C' },
        { id: 5, phone: '0909876543', name: 'Lê Văn C' },
        { id: 6, phone: '0909876543', name: 'Lê Văn C' },
        { id: 7, phone: '0909876543', name: 'Lê Văn C' },
        { id: 8, phone: '0909876543', name: 'Lê Văn C' },
        { id: 9, phone: '0909876543', name: 'Lê Văn C' },
        { id: 11, phone: '0909876543', name: 'Lê Văn C' },
    ];

    const refreshInput = () => {
        setSelectedCustomer(null);
        setName('')
        setPhone('')
    };

    return (
        <div className={styles.screen}>
            <button
                className='toggleButtonSidebar'
                style={{ left: 30, top: 20 }}
                onClick={() => setOpenSidebar(!openSidebar)}
            >☰</button>
            {openSidebar ? <Sidebar openSidebar onOpenSidebar={setOpenSidebar} /> : <></>}

            <div className={styles.container}>
                <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Danh sách khách hàng</h2>


                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15, marginBottom: 8 }}>
                    <div style={{ width: '90%', display: 'flex', flexDirection: 'row' }}>
                        <div className={styles.customInput}>
                            <input type="number" placeholder="Nhập số điện thoại..." />
                            <img src="/image/16-search-icon.png" alt="Search" width={18} />
                        </div>
                        <button className={styles.customButton}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.contentList}>
                        <div className={styles.tableContainer}>
                            <table className={styles.customerTable}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Số điện thoại</th>
                                        <th>Tên khách hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, index) => (
                                        <tr key={customer.id}
                                            className={selectedCustomer?.id === customer.id ? styles.selectedRow : ""}
                                            onClick={() => handleRowClick(customer)}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.contentForm}>
                        <div style={{ margin: 15 }}>
                            <h3 style={{ textAlign: 'center' }}>Thông tin khách hàng</h3> <br/>
                            <p>Số điện thoại:</p>
                            <div style={{ display: 'flex' }}>
                                <div className={styles.customInput}>
                                    <input 
                                        value={phone} 
                                        type="number" 
                                        placeholder="Số điện thoại..." 
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className={styles.customButton} 
                                    style={{ backgroundColor: '#b3b4b4' }}
                                    onClick={refreshInput}
                                >
                                    Làm mới
                                </button>
                            </div>
                            <br />
                            <p>Tên khách hàng:</p>
                            <div className={styles.customInput}>
                                <input 
                                    value={name} 
                                    type="text" 
                                    placeholder="Tên khách hàng..." 
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button 
                                className={clsx(styles.customButton, {
                                    [styles.enableButton]: selectedCustomer ? false : true
                                })} 
                                style={{ backgroundColor: '#ff2b5c' }}
                            >
                                Xoá
                            </button>
                            <button 
                                className={clsx(styles.customButton, {
                                    [styles.enableButton]: selectedCustomer ? false : true
                                })} 
                            >
                                Cập nhật
                            </button>
                            <button 
                                className={clsx(styles.customButton, {
                                    [styles.enableButton]: selectedCustomer ? true : false
                                })} 
                                style={{ width: '27vh', backgroundColor: '#5CC467' }}
                            >
                                Thêm Khách hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customer