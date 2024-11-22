import React, { useState } from 'react';
import Layout from "../../components/Layouts/Layout";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Section2 from "./Section2";
import ProfileTab from "./ProfileTab";

const Information = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  const changeTab = (tab) => {
    setActiveTab(tab);
  }

  return (
    <Layout>
      <Section2 title="Thông tin tài khoản" style={{ maxHeight: '250px' }} />
      <section className="menu_section py-0 mt-3">
        <Container>
          <Row style={{ minHeight: '800px' }}>
            <Col lg={{ span: 2 }}>
              <Row className="bg-white border">
                <div className="text-center pt-2 me-2 d-flex">
                  <span className="p-2 ps-0"><i className="bi bi-person-circle"></i></span>
                  <h4 className="align-content-center">TÀI KHOẢN</h4>
                </div>
                <ul className="nav flex-column bg-white border-top pe-0">
                  <li className="nav-item">
                    <a
                      href="javascript:void(0);"
                      className={`sidebar nav-link ${activeTab === 'Profile' ? 'active' : ''}`}
                      onClick={() => changeTab("Profile")}
                    >
                      Thông tin cá nhân
                      <i className={`bi bi-chevron-right ${activeTab === 'Profile' ? '' : 'd-none'}`}></i>
                    </a>
                  </li>
                  <li className="nav-item border-top">
                    <a
                      className={`sidebar nav-link ${activeTab === 'Favorites' ? 'active' : ''}`}
                      onClick={() => changeTab("Favorites")}
                    >
                      Yêu thích
                      <i className={`bi bi-chevron-right ${activeTab === 'Favorites' ? '' : 'd-none'}`}></i>
                    </a>
                  </li>
                </ul>
              </Row>
            </Col>
            <Col lg={{ span: 10 }}>
              <Row>
                {activeTab === 'Profile' && (
                  <ProfileTab />
                )}
                {activeTab === 'Favorites' && (
                  <div>
                    {/* Favorites content will go here */}
                  </div>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Information; 