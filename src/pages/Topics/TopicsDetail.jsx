import { useParams, Link } from 'react-router-dom';
import { list } from './FullTopics';

function TopicsDetail() {
    const { slug } = useParams();

    // Tìm item nào có đường dẫn kết thúc bằng slug
    const topic = list.find((item) => item.to.endsWith(slug));

    return (
        <div>
            <h1>Danh sách chủ đề</h1>
            <ul>
                {list.map((item, index) => (
                    <li key={index}>
                        <Link to={item.to}>{item.name}</Link>
                    </li>
                ))}
            </ul>

            <hr />

            {topic ? <h2>Chủ đề đang xem: {topic.name}</h2> : <p>Không tìm thấy chủ đề này 😢</p>}
        </div>
    );
}

export default TopicsDetail;
