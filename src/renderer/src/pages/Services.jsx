import '../assets/services.css'

import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { firestore } from '../firebase'
import {
  addDoc,
  collection,
  doc,
  endAt,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc
} from 'firebase/firestore'
import Print from '../components/Print'

const Services = () => {
  const [newServiceModal, setNewServiceModal] = useState(false)
  const [updateServiceModal, setUpdateServiceModal] = useState()
  const [services, setServices] = useState([])
  const [lastVisible, setLastVisible] = useState()
  const [pageSize, setPageSize] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  async function handleNewService(event) {
    event.preventDefault()

    await addDoc(collection(firestore, 'services'), {
      status: 'Teslim Alındı',
      worker: event.target.worker.value,
      platform: event.target.platform.value,
      orderId: event.target.orderId.value,
      shipmentId: event.target.shipmentId.value,
      customer: event.target.customer.value,
      phoneNo: event.target.phoneNo.value,
      address: event.target.address.value,
      product: event.target.product.value,
      complaint: event.target.complaint.value,
      createdAt: Date.now()
    })

    setNewServiceModal(false)
  }

  async function handleUpdateService(event) {
    event.preventDefault()

    await updateDoc(doc(firestore, 'services', updateServiceModal.id), {
      status: event.target.status.value,
      worker: event.target.worker.value,
      platform: event.target.platform.value,
      orderId: event.target.orderId.value,
      shipmentId: event.target.shipmentId.value,
      customer: event.target.customer.value,
      phoneNo: event.target.phoneNo.value,
      address: event.target.address.value,
      product: event.target.product.value,
      createdAt: event.target.createdAt.id,
      description: event.target.description.value,
      complaint: event.target.complaint.value,
      completedAt: event.target.status.value === 'Tamamlandı' ? Date.now() : ''
    })

    setUpdateServiceModal()
  }

  async function fetchData() {
    setLoading(true)
    setIsEmpty(false)
    setServices([])
    const q = query(
      collection(firestore, 'services'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    )
    const documents = await getDocs(q)
    updateState(documents.docs)
  }

  async function fetchMore() {
    setLoading(true)
    const q = query(
      collection(firestore, 'services'),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(pageSize)
    )
    const documents = await getDocs(q)
    updateState(documents.docs)
  }

  async function updateState(documents) {
    setLoading(false)
    if (documents.length === 0) {
      setIsEmpty(true)
      return
    }
    const docs = documents.map((doc) => doc.data())
    const lastDoc = documents[documents.length - 1]
    setServices((services) => [...services, ...docs])
    setLastVisible(lastDoc)
  }

  useEffect(() => {
    fetchData()
  }, [newServiceModal, updateServiceModal])

  return (
    <div>
      <h3>Servisler</h3>
      <div className="table-header">
        <select defaultValue={'customer'}>
          <option value={'customer'}>Ad Soyad</option>
          <option value={'orderId'}>Sipariş Id</option>
          <option value={'shipmentId'}>Kargo Takip</option>
        </select>
        <input type="text" placeholder="Ara.."></input>
        <button onClick={() => setNewServiceModal(true)}>Yeni Servis</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Müşteri</th>
            <th>Ürün</th>
            <th>Durum</th>
            <th>Tarih</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {services.map((data, key) => (
            <tr key={key}>
              <td>{data.customer}</td>
              <td className="customer">{data.product}</td>
              <td>{data.status}</td>
              <td>{new Date(Number.parseInt(data.createdAt)).toLocaleDateString()}</td>
              <td className="actions">
                <button onClick={() => setUpdateServiceModal(data)}>Güncelle</button>
                <Print data={data} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {isEmpty && 'Daha eski servis kaydı bulunamadı'}
        {loading && 'Yükleniyor..'}
        {!loading && !isEmpty && <button onClick={fetchMore}>Daha Eski</button>}
      </div>
      {newServiceModal && (
        <Modal isOpen={newServiceModal} onRequestClose={() => setNewServiceModal(false)}>
          <form className="new-service" onSubmit={handleNewService}>
            <select name="worker">
              <option value={'M**** Ç****'}>M**** Ç****</option>
            </select>
            <select name="platform">
              <option value="n11">n11</option>
              <option value="ePttAVM">ePttAVM</option>
              <option value="HepsiBurada">HepsiBurada</option>
              <option value="Pazarama">Pazarama</option>
            </select>
            <input type="text" name="orderId" placeholder="Sipariş Id" />
            <input type="text" name="shipmentId" placeholder="Kargo Takip" />
            <input type="text" name="customer" placeholder="Adı Soyad" />
            <input type="text" name="phoneNo" placeholder="Numara" />
            <input type="text" name="address" placeholder="Adres" />
            <input type="text" name="product" placeholder="Ürün" />
            <input type="text" name="complaint" placeholder="Servis Nedeni" />
            <button type="submit">Oluştur</button>
          </form>
        </Modal>
      )}
      {updateServiceModal && (
        <Modal isOpen={updateServiceModal} onRequestClose={() => setUpdateServiceModal(false)}>
          <form className="update-service" onSubmit={handleUpdateService}>
            <select name="worker" value={updateServiceModal.worker} disabled>
              <option value={'M**** Ç****'}>M**** Ç****</option>
            </select>
            <select name="platform" value={updateServiceModal.platform} disabled>
              <option value="n11">n11</option>
              <option value="ePttAVM">ePttAVM</option>
              <option value="HepsiBurada">HepsiBurada</option>
              <option value="Pazarama">Pazarama</option>
            </select>
            <input type="text" name="orderId" value={updateServiceModal.orderId} disabled />
            <input type="text" name="shipmentId" value={updateServiceModal.shipmentId} disabled />
            <input type="text" name="customer" value={updateServiceModal.customer} disabled />
            <input type="text" name="phoneNo" value={updateServiceModal.phoneNo} disabled />
            <input type="text" name="address" value={updateServiceModal.address} disabled />
            <input type="text" name="product" value={updateServiceModal.product} disabled />
            <input
              type="text"
              name="createdAt"
              id={updateServiceModal.createdAt}
              value={new Date(Number.parseInt(updateServiceModal.createdAt)).toLocaleDateString()}
              disabled
            />
            <input type="text" name="complaint" value={updateServiceModal.complaint} disabled />
            <input
              type="text"
              multiple
              name="description"
              defaultValue={updateServiceModal.description}
            />
            <select name="status" defaultValue={updateServiceModal.status}>
              <option value="Teslim Alındı">Teslim Alındı</option>
              <option value="İşlem Görüyor">İşlem Görüyor</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </select>
            <button type="submit">Güncelle</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Services
