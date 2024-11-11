import { React, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cards from "../../components/Layouts/Cards";
import { Link } from "react-router-dom";

// Mock
const Section3 = () => {
    const [brandData, setBrandData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch brands when the component is mounted
    useEffect(() => {
        fetch("http://localhost:8080/brand/getAllBrands")
            .then(response => response.json()) // Convert response to JSON
            .then(data => {
                // Map fetched data to match mockData structure
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
                    url_slug: brand.url_slug,
                    rating: brand.rating || 0
                }));
                setBrandData(brandList); // Update mockData with fetched brand data
                setLoading(false);
            })
            .catch(error => {
                setError("Error fetching data: " + error.message);
                setLoading(false);
            });
    }, []); // Empty dependency array to run the effect once when the component mounts
    // if (loading) {
    //     return <p>Loading...</p>;
    // }

    // if (error) {
    //     return <p>{error}</p>;
    // }
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

    return (
        <section className="menu_section">
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} className="text-center mb-5">
                        <h2>ĐI ĐẾN NƠI BẠN MUỐN!</h2>
                        <p className="para">
                            Khám phá và trải nghiệm những địa điểm ăn uống và giải trí
                             xung quanh bạn, quyết định nơi bạn sẽ đến với thông tin của chúng tôi
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col lg={{ span: 2 }}>

                    </Col>
                    <Col lg={{ span: 10 }}>
                        <Row>
                        {brandData.map((brand) => (
                            <Cards
                                id={brand.id}
                                name={brand.name}
                                image={brand.image}
                                status={brand.status}
                                priority={brand.priority}
                                phone={brand.phone}
                                google={brand.google}
                                location={brand.location}
                                facebook={brand.facebook}
                                url_slug={brand.url_slug}
                                rating={brand.rating || 0}
                                renderRatingIcons={renderRatingIcons}
                            />
                        ))}
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
// Rating Logical Data


// function Section3({ brandList }) {
//     return (

//     );
// }

export default Section3;
