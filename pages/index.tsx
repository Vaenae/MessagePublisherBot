import { Login } from '../components/Login'
import { TestButton } from '../components/TestButton'
const Home = () => {
    return (
        <div>
            <h1>Hello</h1>
            <TestButton />
            {<Login />}
        </div>
    )
}

export default Home
