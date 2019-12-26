import { Login } from '../components/Login'
import { TestButton } from '../components/TestButton'
import { TestException } from '../components/TestException'
const Home = () => {
    return (
        <div>
            <h1>Hello</h1>
            <TestButton />
            <TestException />
            {<Login />}
        </div>
    )
}

export default Home
