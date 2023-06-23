import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'

const Print = (props) => {
  let componentRef = useRef()

  return (
    <div>
      <ReactToPrint
        trigger={() => <button style={{ width: '100%' }}>Yazdır</button>}
        content={() => componentRef}
      />

      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={(el) => (componentRef = el)} service={props.data} />
      </div>
    </div>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="print">
        <div className="print-content">
          <h3>Servis Kargo Bilgileri</h3>
          <div className="print-shipment">
            <p>Gönderen: ERCHIN</p>
            <p>İletişim: +90 532 349 90 99</p>
            <p>
              Adres: Abdurrahman Gazi Mh. Sezgin Sok. No 5 Daire 3 Salon Elit Altı Sultanbeyli / İstanbul
            </p>
            <br />
            <p>Alıcı: {this.props.service.customer}</p>
            <p>İletişim: {this.props.service.phoneNo}</p>
            <p>Adres: {this.props.service.address}</p>
          </div>
          <br />
          <h3>Yetkili Servis Fişi</h3>
          <div className="print-header">
            <div>
              <p>İsim: {this.props.service.customer}</p>
              <p>Adres: {this.props.service.address}</p>
              <p>Numara: {this.props.service.phoneNo}</p>
            </div>
            <div>
              <p>Ürün: {this.props.service.product}</p>
              <div>
                <p>Servise Alınma Tarihi:</p>
                {new Date(Number.parseInt(this.props.service.createdAt)).toLocaleDateString()}
              </div>
              <div>
                <p>Servis Bitiş Tarihi:</p>
                {new Date(Number.parseInt(this.props.service.completedAt)).toLocaleDateString()}
              </div>
            </div>
            <div>
              <p>Platform: {this.props.service.platform}</p>
              <div>
                <p>Sipariş Numarası: </p> <br />
                {this.props.service.orderId}
              </div>
              <div>
                <p>Kargo Takip Numarası: {this.props.service.shipmentId}</p>
              </div>
            </div>
          </div>
          <div className="print-footer">
            <p>Şikayet: {this.props.service.complaint}</p>
            <p>Yapılan İşlem: {this.props.service.description}</p>
            <p>İlgili Teknisyen: {this.props.service.worker}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Print
