CREATE TABLE ranking (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL,
    prova_id INT NOT NULL,
    acertos INT NOT NULL,
    media_tempo_resposta DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (aluno_id, prova_id)
);


SELECT aluno_id, prova_id, acertos, media_tempo_resposta
FROM ranking
ORDER BY acertos DESC, media_tempo_resposta ASC;


