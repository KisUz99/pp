package springbook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import springbook.domain.Article;

public interface BlogRepository extends JpaRepository<Article, Long> {
}
