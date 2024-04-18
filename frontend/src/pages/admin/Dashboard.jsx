import NavbarComponent from "../../components/Navbar";
import CardComponent from "../../components/Card";
import FormComponent from "../../components/Form";
import LineChartComponent from "../../components/Linechart";
import BarchartComponent from "../../components/Barchart";
import PieChartComponent from "../../components/Piechart";
import Sidebar from "../../components/Sidebar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import DashboardContent from "../../components/DashboardContent";
import { useState} from "react";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";

function Dashboard(){
   
    const[active, setActive] = useState("Dashboard");

    const navigate = useNavigate();

    const handleDashboardClick = () => {
        setActive("Dashboard")
    }

    const handlePeopleClick = () => {
        setActive("People")
    }

    const handleLogoutClick = () => {

      // Remove token and tokenExpiration from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('phone');
      
      navigate('/');
      // Reload the page
      window.location.reload();
    }

    return(
        <div style={{ display: 'flex', height: '100vh' }}>
      <Container fluid>
        <Row style={{ height: '100%' }}>
          {/* Sidebar */}
          <Col md={3} className="bg-dark text-white sidebar">
            <Card className="bg-dark text-white" style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title>Menu</Card.Title>
                {/* Section 1 */}
                <Card.Text>
                  <Button
                    variant="link"
                    className="text-white"
                    style={{ textDecoration: 'none', fontWeight: 'normal' }}
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Button>
                </Card.Text>

                {/* Section 2 */}
                <Card.Text>
                  <Button
                    variant="link"
                    className="text-white"
                    style={{ textDecoration: 'none', fontWeight: 'normal' }}
                    onClick={handlePeopleClick}
                  >
                    People
                  </Button>
                </Card.Text>

                {/* Section 3 */}
                <Card.Text>
                  <Button
                    variant="link"
                    className="text-white"
                    style={{ textDecoration: 'none', fontWeight: 'normal' }}
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </Button>
                </Card.Text>

              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={9} className="main-content">
    
            {/* Conditional Rendering based on active section */}
            {active === 'Dashboard' && (
              <div>
                {/* Dashboard content goes here */}
                <DashboardContent/>
              </div>
            )}
            {active === 'People' && (
              <div>
                {/* People content goes here */}
                <TableComponent/>
              </div>
            )}

          </Col>
        </Row>
      </Container>
    </div>
    )
}

export default Dashboard;