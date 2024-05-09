<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function listMovies(): JsonResponse
    {
        $movies = $this->movieRepository->findAll();
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }

    #[Route('/genres', methods: ['GET'])]
    public function listGenres(): JsonResponse
    {
        $genres = $this->genreRepository->findAll();
        $data = $this->serializer->serialize($genres, "json", ["default"]);

        return new JsonResponse($data, json: true);
    }

    #[Route('/testFindOneBySomeField/{id}', methods: ['GET'])]
    public function testFindOneBySomeField($id): JsonResponse
    {
        $movies = $this->movieRepository->findMoviesByGenre($id);
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);
    
        return new JsonResponse($data, json: true);
    }

}
