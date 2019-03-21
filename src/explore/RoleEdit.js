import React, { Component } from 'react';
import { Link, withRouter, BrowserRouter as Router} from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
//import AppNavbar from './AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import axios from 'axios';

class RoleEdit extends Component {
  emptyItem = {
      roleName: "",
      password:""
  };

  state = {
    roleName: "",
    password:"",
    privilages:[]
  }

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      privilages : [],
      selectedPrivilages: []
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    //alert(this.props.match.params.id);
    if (this.props.match.params.id !== 'new') {
      const role = await (await fetch(`http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080/api/v1/roles/${this.props.match.params.id}`)).json();
      console.log(role);
      this.setState(
        {item: role,
          roleName:role.label,
          rolePassword:role.password,
          privilages:role.privilages
        });
    } else {
      this.setState({showForm: true});
      return axios.get(`http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080/api/v1/roles/privilages`)
      .then(result => {
        console.log(result);
        this.setState({
          privilages: result.data, error:false});
        }).catch(error => {
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
    }
  }

  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  async handleSubmit(event) {
    //event.preventDefault();
    const {item, roleName, password, selectedPrivilages} = this.state;
    //alert(selectedItems.length);   
  //   alert('School = '+selectedSchool.label);
  //  alert('Grade = '+selectedGrade.label);
  //   alert('Section = '+selectedSection.label);
  //   alert('Group = '+groupName);
    
    await fetch('/api/school', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/roles');
  }

  render() {
    const {item,  roleName, rolePassword, privilages, selectedPrivilages} = this.state;
    const title = <h2>{item.id ? 'Edit Role' : 'Add Role'}</h2>;
    return <div className="app">
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <div className="row">
                <FormGroup className="col-md-3 mb-3">
                    <Label for="roleName">Role Name</Label>
                    <Input type="text" ref="roleName" name="roleName" id="roleName" placeholder="Enter Role Name" onChange={e => this.onChange(e)}  value={roleName}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="password">Password</Label>
                    <Input ref="rolePassword"  name="rolePassword" placeholder="Enter Role Password" 
                        type="password"
                        onChange={e => this.onChange(e)} 
                        value={rolePassword} />
                </FormGroup>
            </div>
            <div className="row">
              <FormGroup className="col-md-7 mb-3">
                <Label for="student">Privilage's</Label>
                <MultiSelect items={privilages} selectedItems={selectedPrivilages} onChange={this.handleEditMultiChange}/>
              </FormGroup>
            </div>
          <FormGroup>   
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="success" tag={Link} to="/roles">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}
export default RoleEdit;