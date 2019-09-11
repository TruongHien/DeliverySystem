import React, { Component } from 'react'
import { Layout, ProductRepository } from '../../component/index'

export default class List_Product_Repository extends Component {

  render() {
      
    return (
        <Layout pageName="Sản Phẩm Kho">
            <ProductRepository/>
        </Layout>
    )
  }
}
