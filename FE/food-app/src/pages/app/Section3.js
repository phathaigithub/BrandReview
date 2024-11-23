import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import BrandTab from "./BrandTab";

// Mock
const Section3 = () => {
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  
  // Fetch brands when the component is mounted
  useEffect(() => {
    fetch("http://localhost:8080/brand/getAllBrands")
      .then(response => response.json())
      .then(data => {
        const brandList = data.map((brand, index) => ({
          id: brand.id,
          name: brand.name,
          status: brand.status,
          priority: brand.priority,
          phone: brand.phone,
          google: brand.google,
          location: brand.location,
          facebook: brand.facebook,
          image: brand.image,
          slug: brand.slug,
          reviews: brand.reviews,
          rating: brand.rating || 0,
          type: brand.brandType
        }));
        setBrandData(brandList);
        setLoading(false);
      })
      .catch(error => {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      });
  }, []);


  const renderRatingIcons = (rating) => {
    const stars = [];
    for (let i = 0; i < 10; i++) {
      if (rating > 0.5) {
        stars.push(<i key={i} className="bi bi-star-fill"></i>);
        rating--;
      } else if (rating > 0 && rating < 1) {
        stars.push(<i key={"half"} className="bi bi-star-half"></i>);
        rating--;
      } else {
        stars.push(<i key={`empty${i}`} className="bi bi-star"></i>);
      }
    }
    return stars;
  };
  const changeCategory = (cate) => {
    setCategory(cate);
  }
  return (
    <section className="menu_section py-0 pt-3">
      <Container>
        
        <Row style={{ minHeight: '800px' }}>
          <Col lg={{ span: 2 }}>
            <Row className="bg-white border">
              <div className="text-center pt-2 me-2 d-flex">
                <span className="p-2 ps-0"><i className="bi bi-body-text"></i></span>
                <h4 className="align-content-center">KHÁM PHÁ</h4>
              </div>
              <ul className="nav flex-column bg-white border-top pe-0">
                <li className="nav-item">
                  <a href="javascript:void(0);" className="sidebar nav-link active">
                    Thương hiệu
                    <i className="bi bi-chevron-down"></i>
                  </a>
                  <a href="javascript:void(0);" className={`sidebar nav-link ps-4 ${category === 'Ăn uống' ? 'active' : ''}`} onClick={() => changeCategory('Ăn uống')}>
                    Ăn uống
                  </a>
                  <a href="javascript:void(0);" className={`sidebar nav-link ps-4 ${category === 'Giải trí' ? 'active' : ''}`} onClick={() => changeCategory('Giải trí')}>
                    Giải trí
                  </a>
                  <a href="javascript:void(0);" className={`sidebar nav-link ps-4 ${category === 'Du lịch' ? 'active' : ''}`} onClick={() => changeCategory('Du lịch')}>
                    Du lịch
                  </a>
                  <a href="javascript:void(0);" className={`sidebar nav-link ps-4 ${category === 'Mua sắm' ? 'active' : ''}`} onClick={() => changeCategory('Mua sắm')}>
                    Mua sắm
                  </a>
                </li>
              </ul>
            </Row>
          </Col>
          <Col lg={{ span: 10 }}>
            <Row>
              <BrandTab
                brandData={brandData}
                renderRatingIcons={renderRatingIcons}
                type={category}
              />
            </Row>
          </Col>
        </Row>
        <Row className="pt-5">
          <Col sm={6} lg={5}>
            <div className="ads_box ads_img1 mb-5 mb-md-0">
              <h4 className="mb-0">GET YOUR FREE</h4>
              <h5>CHEESE FRIES</h5>
              <Link to="/" className="btn btn_red px-4 rounded-0">
                Learn More
              </Link>
            </div>
          </Col>
          <Col sm={6} lg={7}>
            <div className="ads_box ads_img2">
              <h4 className="mb-0">GET YOUR FREE</h4>
              <h5>CHEESE FRIES</h5>
              <Link to="/" className="btn btn_red px-4 rounded-0">
                Learn More
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section3;
