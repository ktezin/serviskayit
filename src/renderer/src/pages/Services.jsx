import '../assets/services.css'

import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { firestore } from '../firebase'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where
} from 'firebase/firestore'
import Print from '../components/Print'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

const platforms = ['n11', 'ePttAVM', 'HepsiBurada', 'Pazarama', 'AllesGo', 'ÇiçekSepeti']

const products = [
  { name: 'Dyson Airwrap Complete Multi-Styler Prusya Mavisi (İthalatçı Garantili)' },
  { name: 'Dyson Airwrap Complete Multi-Styler Long Niker-Bakır-Gold (İthalatçı Garantili)' },
  { name: 'Dyson Airwrap Complete Multi-Styler Long Vinca Mavisi (İthalatçı Garantili)' }
]

const Services = () => {
  const [newServiceModal, setNewServiceModal] = useState(false)
  const [updateServiceModal, setUpdateServiceModal] = useState(null)
  const [services, setServices] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [sortBy, setSortBy] = useState('desc')
  const [searchBy, setSearchBy] = useState('customer')
  const [selectedProduct, setSelectedProduct] = useState('')

  async function handleSearchSubmit(event) {
    event.preventDefault()

    const q = query(
      collection(firestore, 'services'),
      orderBy('createdAt', 'desc'),
      where(searchBy, '==', event.target.search.value)
    )
    const documents = await getDocs(q)
    if (documents.docs.empty) return
    const doc = documents.docs[0]
    setUpdateServiceModal(doc)
  }

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
      product: selectedProduct,
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

    setUpdateServiceModal(null)
  }

  async function fetchData() {
    setLoading(true)
    setIsEmpty(false)
    setServices([])
    const q = query(
      collection(firestore, 'services'),
      orderBy('createdAt', sortBy),
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
    const lastDoc = documents[documents.length - 1]
    setServices((services) => [...services, ...documents])
    setLastVisible(lastDoc)
  }

  useEffect(() => {
    fetchData()
  }, [newServiceModal, updateServiceModal, sortBy])

  return (
    <div>
      <h3>Servisler</h3>
      <div className="table-header">
        <div>
          <select defaultValue={'customer'} onChange={(event) => setSearchBy(event.target.value)}>
            <option value={'customer'}>Ad Soyad</option>
            <option value={'orderId'}>Sipariş Id</option>
            <option value={'shipmentId'}>Kargo Takip</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit}>
          <input name="search" type="text" placeholder="Ara.." />
        </form>
        <div>
          <button onClick={() => setNewServiceModal(true)}>Yeni Servis</button>
          <button onClick={() => setSortBy((sortBy) => (sortBy === 'desc' ? 'asc' : 'desc'))}>
            Sırala
          </button>
        </div>
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
              <td>{data.data().customer}</td>
              <td className="customer">{data.data().product}</td>
              <td>{data.data().status}</td>
              <td>{new Date(Number.parseInt(data.data().createdAt)).toLocaleDateString()}</td>
              <td className="actions">
                <button onClick={() => setUpdateServiceModal(data)}>Güncelle</button>
                <Print data={data.data()} />
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
              {platforms.map((platform, key) => (
                <option value={platform} key={key}>
                  {platform}
                </option>
              ))}
            </select>
            <input type="text" name="orderId" placeholder="Sipariş Id" required />
            <input type="text" name="shipmentId" placeholder="Kargo Takip" required/>
            <input type="text" name="customer" placeholder="Adı Soyad" required/>
            <input type="text" name="phoneNo" placeholder="Numara" required/>
            <input type="text" name="address" placeholder="Adres" required/>
            <ReactSearchAutocomplete
              placeholder="Ürün"
              items={products}
              autoFocus
              onSelect={(result) => setSelectedProduct(result.name)}
              onSearch={(name) => setSelectedProduct(name)}
              formatResult={(item) => (
                <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
              )}
              className="search"
            />
            <input type="text" name="complaint" placeholder="Servis Nedeni" required/>
            <button type="submit">Oluştur</button>
          </form>
        </Modal>
      )}
      {updateServiceModal && (
        <Modal
          isOpen={updateServiceModal !== null}
          onRequestClose={() => setUpdateServiceModal(null)}
        >
          <form className="update-service" onSubmit={handleUpdateService}>
            <select name="worker" value={updateServiceModal.data().worker} disabled>
              <option value={'M**** Ç****'}>M**** Ç****</option>
            </select>
            <input
              type="text"
              name="customer"
              value={updateServiceModal.data().customer}
              disabled
            />
            <input
              type="text"
              name="createdAt"
              id={updateServiceModal.data().createdAt}
              value={new Date(
                Number.parseInt(updateServiceModal.data().createdAt)
              ).toLocaleDateString()}
              disabled
            />
             <input
              type="text"
              name="complaint"
              value={updateServiceModal.data().complaint}
              disabled
            />
            <select name="platform" value={updateServiceModal.data().platform}>
              {platforms.map((platform, key) => (
                <option value={platform} key={key}>
                  {platform}
                </option>
              ))}
            </select>
            <input type="text" name="orderId" defaultValue={updateServiceModal.data().orderId} placeholder='Sipariş Numarası'/>
            <input
              type="text"
              name="shipmentId"
              defaultValue={updateServiceModal.data().shipmentId}
              placeholder='Kargo Numarası'
            />
            
            <input type="text" name="phoneNo" defaultValue={updateServiceModal.data().phoneNo} placeholder='Telefon Numarası'/>
            <input type="text" name="address" defaultValue={updateServiceModal.data().address} placeholder='Adres' />
            <input type="text" name="product" defaultValue={updateServiceModal.data().product} placeholder='Ürün Adı' />
            
            <input
              type="text"
              multiple
              name="description"
              defaultValue={updateServiceModal.data().description}
              placeholder='Uygulanan İşlem'
            />
            <select name="status" defaultValue={updateServiceModal.data().status}>
              <option value="Teslim Alındı">Teslim Alındı</option>
              <option value="Bekletiliyor">Bekletiliyor</option>
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
