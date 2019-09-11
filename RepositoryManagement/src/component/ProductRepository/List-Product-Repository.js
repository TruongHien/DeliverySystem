import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom'
import './List-Product-Repository.css';
import { connect } from 'react-redux'
import ApiService from '../../services/apiService'
import until from '../../services/until.curency'

const mapStateToProps = (state) => {
    return {
      user: state.user,
      access_token: state.access_token
    }
}

class ListProductRepository extends Component {
    displayName = "List product";
    
    constructor(props) {
    super(props);
        this.apiService = ApiService();
        this.state = {
            Product: null,
            Category: [],
            Page: 1,
            TotalPage: null,
            categoryID: null,
            isToken: false,
            stt: 1
        };
    }

    componentDidMount(){
        this.apiService.getCategory(this.props.access_token).then((data)=>{
            this.setState({
                Category: data
            })
        }).catch((e) => {
            let error = 'Có lỗi sảy ra. vui lòng thử lại'
            if (e.status === 401) {
                error = 'Không có quyền truy cập'
                this.setState({
                    isToken: true
                })
            }
            this.setState({
                error: error
            })
        })
        this.apiService.getListProductRepository(this.state.Page, 10, this.state.categoryID, this.props.access_token).then((data)=>{
            this.setState({
                Product: data.Products,
                Page: data.Page,
                TotalPage: data.TotalPage
            })
        }).catch((e) => {
            let error = 'Có lỗi sảy ra. vui lòng thử lại'
            if (e.status === 401) {
                error = 'Không có quyền truy cập'
                this.setState({
                    isToken: true
                })
            }
            this.setState({
                error: error
            })
        })
    }
    
    componentDidUpdate(prevProps, prevState){
        if(this.state.categoryID!==prevState.categoryID || this.state.Page !== prevState.Page){
            this.apiService.getListProductRepository(this.state.Page, 10, this.state.categoryID, this.props.access_token).then((data)=>{
                this.setState({
                    Product: data.Products,
                    Page: data.Page,
                    TotalPage: data.TotalPage
                })
            }).catch((e) => {
                let error = 'Có lỗi sảy ra. vui lòng thử lại'
                if (e.status === 401) {
                    error = 'Không có quyền truy cập'
                    this.setState({
                        isToken: true
                    })
                }
                this.setState({
                    error: error
                })
            })
        }
    }

    chooseCategory = (e)=>{
        if (e.target.value === "Chọn Loại"){
            this.setState({
                categoryID: null
            })
        }
        else{
            this.setState({
                categoryID: e.target.value
            })
        }
    }

    handlePreviousPage = ()=>{
        this.setState({
            Page: this.state.Page - 1,
            stt: this.state.stt - 10
        })
    }

    handleNextPage= ()=>{
        this.setState({
            Page: this.state.Page + 1,
            stt: this.state.stt + 10
        })
    }

    render() {
        if(this.state.isToken === true){
            return <Redirect to='/Login'/>
        }
        let Role = localStorage.getItem('Role')
        if(Role !== "Storekeeper"){
            return <Redirect to='/'/>
        }
        return (
            <div className="product-status mg-b-15">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="product-status-wrap drp-lst">
                            <h4>DANH SÁCH SẢN PHẨM</h4>
                            <div className="form-group choose">
                                <select className="form-control option" id="exampleSelect1" onChange={this.chooseCategory}>
                                <option >Chọn Loại</option>
                                {this.state.Category && this.state.Category.map((item, i)=>
                                    <option key={i} value={item.ID} >{item.Name}</option>
                                )}
                                </select>
                            </div>
                            <div className="asset-inner">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên Sản Phẩm</th>
                                            <th>Loại</th>
                                            <th>Giá</th>
                                            <th>Số Lượng</th>
                                            <th>Hình Ảnh</th>
                                            <th>Mô Tả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.Product && this.state.Product.map((temp, i)=>
                                        <tr key={i}>
                                            <td>{this.state.stt + i}</td>
                                            <td>{temp.Name}</td>
                                            <td>{temp.Category}</td>
                                            <td>{until.showVNDCurrency(temp.Price)}</td>
                                            <td>{temp.Quantity}</td>
                                            <td>
                                                <img src={temp.Image} className="img-responsive" alt=""/>
                                            </td>
                                            <td>{temp.Description}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="custom-pagination">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {+this.state.Page > 1 ?
                                        <li className="page-item"><Link to={`/Product/${(+this.state.Page - 1)}`}  onClick={this.handlePreviousPage}>← 10 Trước</Link></li>
                                        : null
                                        }
                                        {this.state.Page < this.state.TotalPage ?
                                        <li className="page-item"><Link to={`/Product/${(+this.state.Page + 1)}`} onClick={this.handleNextPage}> Sau 10 →</Link></li>
                                        : null
                                        }
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default connect(mapStateToProps) (ListProductRepository);
