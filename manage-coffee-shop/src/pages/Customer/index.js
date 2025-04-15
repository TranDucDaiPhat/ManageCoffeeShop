import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { toast } from "react-toastify";
import styles from './Customer.module.css'
import { Sidebar } from '../../components';
import { fetchCustomer, findCustomerByPhone, createCustomer } from '../../API';
import { useAuth } from "../../AuthContext";

function Customer() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { role } = useAuth();

    const handleRowClick = (customer) => {
        setSelectedCustomer(customer);
        setName(customer.customerName)
        setPhone(customer.customerPhone)
    };

    useEffect(() => {
        const getCustomers = async () => {
            const data = await fetchCustomer()
            if (data) {
                setCustomers(data)
            }
        }
        if (role == 'ADMIN') {
            getCustomers()
        }
    }, []);

    const refreshInput = () => {
        setSelectedCustomer(null);
        setName('')
        setPhone('')
    };

    const handleFindCustomer = async () => {
        const text = searchInput.trim()
        if (text.length != 10) {
            toast.error("Vui lòng nhập đúng số điện thoại")
            return;
        }
        const data = await findCustomerByPhone(text)
        console.log(data)
        if (data) {
            setCustomers([data]);
        } else {
            toast.error("Không tìm thấy khách hàng");
        }
    }

    async function handleAddCustomer() {
        // Kiểm tra thông tin hợp lệ
        if (phone.trim().length != 10 || name.trim() == '') {
            toast.error("Vui lòng nhập tên và số điện thoại khách hàng!");
            return;
        }
        console.log({customerName: name, customerPhone: phone})
        const data = await createCustomer({customerName: name, customerPhone: phone})
        console.log(data)
        if (data) {
            toast.success("Thêm khách hàng thành công");
            setCustomers([...customers,data]);
        } else {
            toast.error("Không tìm thấy khách hàng");
        }
    }

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
                            <input 
                                type="number" 
                                placeholder="Nhập số điện thoại..."
                                value={searchInput}
                                onChange={(e) => {setSearchInput(e.target.value)}}
                            />
                            <img src="/image/16-search-icon.png" alt="Search" width={18} />
                        </div>
                        <button className={styles.customButton} onClick={handleFindCustomer} >
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
                                        <tr key={customer.customerId}
                                            className={selectedCustomer?.customerId === customer.customerId ? styles.selectedRow : ""}
                                            onClick={() => handleRowClick(customer)}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{customer.customerPhone}</td>
                                            <td>{customer.customerName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.contentForm}>
                        <div style={{ margin: 15 }}>
                            <h3 style={{ textAlign: 'center' }}>Thông tin khách hàng</h3> <br />
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
                                onClick={handleAddCustomer}
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